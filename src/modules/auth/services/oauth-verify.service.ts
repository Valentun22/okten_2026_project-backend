import { Injectable, UnauthorizedException } from '@nestjs/common';

import { OAuthProviderEnum } from '../../../database/entities/enums/oauth-provider.enum';

export interface IOAuthUserData {
  oauthId: string;
  email: string;
  name: string;
  image?: string;
}

@Injectable()
export class OAuthVerifyService {
  /**
   * Верифікує токен від OAuth-провайдера і повертає дані юзера.
   * Зараз — заглушки. Замінити на реальні SDK/API calls.
   */
  async verify(
    provider: OAuthProviderEnum,
    token: string,
  ): Promise<IOAuthUserData> {
    switch (provider) {
      case OAuthProviderEnum.GOOGLE:
        return await this.verifyGoogle(token);
      case OAuthProviderEnum.FACEBOOK:
        return await this.verifyFacebook(token);
      case OAuthProviderEnum.GOOGLE_PLAY:
        return await this.verifyGooglePlay(token);
      case OAuthProviderEnum.APP_STORE:
        return await this.verifyAppStore(token);
      default:
        throw new UnauthorizedException('Непідтримуваний OAuth провайдер');
    }
  }

  private async verifyGoogle(token: string): Promise<IOAuthUserData> {
    // TODO: замінити на реальну перевірку через google-auth-library
    // import { OAuth2Client } from 'google-auth-library';
    // const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    // const ticket = await client.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID });
    // const payload = ticket.getPayload();
    // return { oauthId: payload.sub, email: payload.email, name: payload.name, image: payload.picture };

    // --- ЗАГЛУШКА (видалити після підключення реального SDK) ---
    if (!token.startsWith('mock-token-from-google')) {
      throw new UnauthorizedException('Невалідний Google токен');
    }
    return {
      oauthId: 'google_stub_id',
      email: 'stub@gmail.com',
      name: 'Google User',
    };
  }

  private async verifyFacebook(token: string): Promise<IOAuthUserData> {
    // TODO: замінити на виклик Facebook Graph API
    // const res = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${token}`);
    // const data = await res.json();
    // if (data.error) throw new UnauthorizedException('Невалідний Facebook токен');
    // return { oauthId: data.id, email: data.email, name: data.name, image: data.picture?.data?.url };

    if (!token.startsWith('mock-token-from-facebook')) {
      throw new UnauthorizedException('Невалідний Facebook токен');
    }
    return {
      oauthId: 'fb_stub_id',
      email: 'stub@facebook.com',
      name: 'Facebook User',
    };
  }

  private async verifyGooglePlay(token: string): Promise<IOAuthUserData> {
    // TODO: Google Play використовує той самий Google Identity (той самий verifyGoogle)
    // або серверний виклик Google Play Developer API для перевірки purchase/auth token
    return await this.verifyGoogle(token.replace('google-play', 'google'));
  }

  private async verifyAppStore(token: string): Promise<IOAuthUserData> {
    // TODO: замінити на Sign In with Apple — верифікація identity token через Apple's public keys
    // import * as appleSignin from 'apple-signin-auth';
    // const payload = await appleSignin.verifyIdToken(token, { audience: 'com.your.bundle.id' });
    // return { oauthId: payload.sub, email: payload.email, name: 'Apple User' };

    if (!token.startsWith('mock-token-from-app-store')) {
      throw new UnauthorizedException('Невалідний App Store токен');
    }
    return {
      oauthId: 'apple_stub_id',
      email: 'stub@icloud.com',
      name: 'Apple User',
    };
  }
}
