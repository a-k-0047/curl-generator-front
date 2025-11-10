import * as cdk from 'aws-cdk-lib';
import { Distribution } from 'aws-cdk-lib/aws-cloudfront';
import { S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class ReactSiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // context からアプリ名・環境名を取得
    const appName = this.node.tryGetContext("appName") || "my-react-app";
    const envName = this.node.tryGetContext("envName") || "dev";

    // バケット名: {アプリ名}-{環境名}
    const bucketName = `${appName}-${envName}`;

    // S3バケット作成
    const siteBucket = new Bucket(this, "ReactSiteBucket", {
      bucketName,
      publicReadAccess: false, // プライベート
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html", // SPA用
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // CloudFrontディストリビューション
    const distribution = new Distribution(this, "ReactSiteDistribution", {
      defaultRootObject: "index.html",
      comment: bucketName,
      defaultBehavior: {
        origin: S3BucketOrigin.withOriginAccessControl(siteBucket),
        viewerProtocolPolicy:
          cdk.aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
        },
      ],
    });

    // 出力情報
    new cdk.CfnOutput(this, "CloudFrontURL", {
      value: `https://${distribution.distributionDomainName}`,
    });
    new cdk.CfnOutput(this, "S3BucketName", {
      value: siteBucket.bucketName,
    });
  }
}
