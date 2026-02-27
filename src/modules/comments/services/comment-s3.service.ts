import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { extname } from 'path';

@Injectable()
export class CommentS3Service {
  private readonly s3 = new S3Client({
    region: process.env.AWS_S3_REGION!,
    endpoint: process.env.AWS_S3_ENDPOINT!,
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY!,
      secretAccessKey: process.env.AWS_S3_SECRET_KEY!,
    },
  });

  private readonly bucket = process.env.AWS_S3_BUCKET_NAME!;
  private readonly bucketUrl = process.env.AWS_S3_BUCKET_URL!;

  public async uploadCheck(
    file: Express.Multer.File,
  ): Promise<{ key: string; url: string }> {
    const ext = (extname(file.originalname) || '.jpg').toLowerCase();
    const key = `comments/checks/${randomUUID()}${ext}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return {
      key,
      url: `${this.bucketUrl}/${key}`,
    };
  }
}
