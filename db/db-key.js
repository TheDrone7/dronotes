const key = `-----BEGIN PRIVATE KEY-----\n${process.env.DB_KEY.replace(new RegExp(' ', 'g'), '\n')}\n-----END PRIVATE KEY-----\n`

export default {
  "type": "service_account",
  "project_id": "repluptimer",
  "private_key_id": process.env.DB_KEY_ID,
  "private_key": key,
  "client_email": "firebase-adminsdk-9e0o1@repluptimer.iam.gserviceaccount.com",
  "client_id": "117521747550717729369",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-9e0o1%40repluptimer.iam.gserviceaccount.com"
};
