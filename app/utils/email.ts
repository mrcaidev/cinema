import { Resend } from "resend";

const client = new Resend(process.env.RESEND_API_KEY);

type SendEmailPayload = {
  to: string;
  subject: string;
  text: string;
};

export async function sendEmail(payload: SendEmailPayload) {
  if (import.meta.env.DEV) {
    console.log(
      `Sent email:\n[From]\nnotifications@mrcai.dev\n[To]\n${payload.to}\n[Subject]\n${payload.subject}\n[Text]\n${payload.text}`,
    );
    return;
  }

  const { data, error } = await client.emails.send({
    from: "Cinema <notifications@mrcai.dev>",
    ...payload,
  });

  if (error) {
    throw new Error(error.message);
  }

  console.log(`Sent email: ${data?.id}`);
}
