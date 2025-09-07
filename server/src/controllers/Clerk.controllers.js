// src/controllers/ClerkWebhook.controller.js

import dotenv from "dotenv";
import { verifyWebhook } from "@clerk/backend/webhooks";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { User } from "../models/User.js";
import { connectdb } from "../db/index.js";

dotenv.config();

// Clerk Webhook Handler
export const ClerkWebhookHandler = async (req, res) => {
    try {
        const signature = req.headers["clerk-signature"];
        const secret = process.env.CLERK_WEBHOOK_SECRET;

        // Use raw body for signature verification
        const rawBody = req.rawBody || JSON.stringify(req.body);

        // Verify Clerk webhook signature
        let event;
        try {
            event = await verifyWebhook({
                signingSecret: secret,
                payload: rawBody,
                signature,
            });
        } catch (err) {
            console.warn("❌ Invalid Clerk webhook signature:", err);
            return res.status(400).send("Invalid signature");
        }

        console.log("✅ Clerk webhook event received:", event.type);

        // Connect to MongoDB
        await connectdb();

        // 1️⃣ USER CREATED
        if (event.type === "user.created") {
            const user = event.data;

            await User.create({
                clerkId: user.id,
                email: user.email_addresses?.[0]?.email_address || "",
                firstName: user.first_name,
                lastName: user.last_name,
                username: user.username,
                imageUrl: user.image_url,
                createdAt: new Date(user.created_at),
            });

            console.log("🆕 User created & stored:", user.id);
        }

        // 2️⃣ SESSION CREATED
        else if (event.type === "session.created") {
            const session = event.data;

            const user = await clerkClient.users.getUser(session.user_id);

            await User.findOneAndUpdate(
                { clerkId: user.id },
                { lastLoginAt: new Date(session.created_at) },
                { upsert: true }
            );

            console.log("🔑 Session created & login time updated:", user.id);
        }

        // 3️⃣ SESSION ENDED
        else if (event.type === "session.ended") {
            const session = event.data;
            console.log("👋 User logged out:", session.user_id);
            // Optionally update session status here
        }

        return res.status(200).send("Webhook processed");
    } catch (error) {
        console.error("❌ Webhook handler error:", error);
        return res.status(500).send("Internal Server Error");
    }
};
