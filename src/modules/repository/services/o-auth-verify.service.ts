import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import * as https from 'https';

import { OAuthProviderEnum } from '../../../database/entities/enums/oauth-provider.enum';

export interface IOAuthUserData {
  oauthId: string;
  email: string;
  name: string;
  image?: string;
}

function httpsGet(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch {
            reject(new Error('JSON parse error'));
          }
        });
      })
      .on('error', reject);
  });
}

function decodeJwtPayload(token: string): any {
  const parts = token.split('.');
  if (parts.length < 2) throw new Error('Invalid JWT');
  const payload = Buffer.from(parts[1], 'base64url').toString('utf8');
  return JSON.parse(payload);
}

@Injectable()
export class OAuthVerifyService {
  async verify(
    provider: OAuthProviderEnum,
    token: string,
  ): Promise<IOAuthUserData> {
    switch (provider) {
      case OAuthProviderEnum.GOOGLE:
      case OAuthProviderEnum.GOOGLE_PLAY:
        return await this.verifyGoogle(token);
      case OAuthProviderEnum.FACEBOOK:
        return await this.verifyFacebook(token);
      case OAuthProviderEnum.APP_STORE:
        return await this.verifyApple(token);
      default:
        throw new UnauthorizedException('Непідтримуваний OAuth провайдер');
    }
  }

  private async verifyGoogle(token: string): Promise<IOAuthUserData> {
    const data = await httpsGet(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token)}`,
    );

    if (data.error) {
      throw new UnauthorizedException(`Невалідний Google токен: ${data.error}`);
    }

    return {
      oauthId: data.sub,
      email: data.email,
      name: data.name ?? data.email?.split('@')[0] ?? 'Google User',
      image: data.picture,
    };
  }

  private async verifyFacebook(token: string): Promise<IOAuthUserData> {
    const fields = 'id,name,email,picture.type(large)';
    const url = `https://graph.facebook.com/me?fields=${fields}&access_token=${encodeURIComponent(token)}`;
    const data = await httpsGet(url);

    if (data.error) {
      throw new UnauthorizedException(
        `Невалідний Facebook токен: ${data.error.message}`,
      );
    }

    return {
      oauthId: data.id,
      email: data.email ?? `fb_${data.id}@noemail.local`,
      name: data.name ?? 'Facebook User',
      image: data.picture?.data?.url,
    };
  }

  private async verifyApple(token: string): Promise<IOAuthUserData> {
    const keysData = await httpsGet('https://appleid.apple.com/auth/keys');
    const keys: any[] = keysData.keys ?? [];

    const headerB64 = token.split('.')[0];
    const header = JSON.parse(Buffer.from(headerB64, 'base64url').toString());
    const key = keys.find((k) => k.kid === header.kid);

    if (!key) {
      throw new UnauthorizedException(
        'Apple public key not found for kid: ' + header.kid,
      );
    }

    const pubKey = crypto.createPublicKey({ key, format: 'jwk' });
    const pem = pubKey.export({ type: 'spki', format: 'pem' });

    const [headerPart, payloadPart, sigPart] = token.split('.');
    const sigData = `${headerPart}.${payloadPart}`;
    const sig = Buffer.from(sigPart, 'base64url');

    const verify = crypto.createVerify('RSA-SHA256');
    verify.update(sigData);
    const valid = verify.verify(pem, sig);

    if (!valid) {
      throw new UnauthorizedException('Невалідний Apple токен: bad signature');
    }

    const payload = decodeJwtPayload(token);

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException('Apple токен прострочений');
    }

    return {
      oauthId: payload.sub,
      email: payload.email ?? `apple_${payload.sub}@privaterelay.appleid.com`,
      name: payload.email?.split('@')[0] ?? 'Apple User',
    };
  }
}
