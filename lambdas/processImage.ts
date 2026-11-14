import { SQSHandler } from "aws-lambda";
import {
  GetObjectCommand,
  GetObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";

const s3 = new S3Client();

export const handler: SQSHandler = async (event) => {
  console.log("Event ", JSON.stringify(event));
  for (const record of event.Records) {
    const recordBody = JSON.parse(record.body); // SQS body is a JSON string
    if (recordBody.Records) {
      console.log("Record body ", JSON.stringify(recordBody));
      for (const messageRecord of recordBody.Records) {
        const s3e = messageRecord.s3;
        const srcBucket = s3e.bucket.name;
        // Keys can contain spaces or non-ASCII characters
        const srcKey = decodeURIComponent(s3e.object.key.replace(/\+/g, " "));
        try {
          const params: GetObjectCommandInput = {
            Bucket: srcBucket,
            Key: srcKey,
          };
          const theImage = await s3.send(new GetObjectCommand(params));
          // Process the image here if required
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
};