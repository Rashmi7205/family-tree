import { NextRequest, NextResponse } from "next/server";
import Contact from "@/models/Contact";
import connectDB from "@/lib/mongodb";
import { sendMail } from "@/lib/email/send-email";

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Parse request body
    const body = await request.json();
    const { firstName, lastName, email, subject, message } = body;

    // Basic validation
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Create contact record
    const contact = new Contact({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      subject: subject.trim(),
      message: message.trim(),
      status: "pending",
    });

    // Save to database
    await contact.save();

    // Send notification email to admin (optional)
    try {
      await sendMail({
        to: process.env.ADMIN_EMAIL || "admin@familytreeexplorer.com",
        subject: `New Contact Form Submission: ${subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send admin notification email:", emailError);
      // Don't fail the request if email fails
    }

    // Send confirmation email to user (optional)
    try {
      await sendMail({
        to: email,
        subject:
          "Thank you for contacting us - Durga Dham Family Tree Explorer",
        html: `
          <h2>Thank you for contacting us!</h2>
          <p>Dear ${firstName},</p>
          <p>We have received your message and will get back to you as soon as possible.</p>
          <p><strong>Your message:</strong></p>
          <p><em>${message}</em></p>
          <p>Best regards,<br>The Durga Dham Family Tree Explorer Team</p>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for your message. We will get back to you soon!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form submission error:", error);

    // Check if it's a duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        {
          error:
            "A message with this email already exists. Please wait before submitting another.",
        },
        { status: 409 }
      );
    }

    // Check if it's a validation error
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        { error: validationErrors.join(", ") },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
