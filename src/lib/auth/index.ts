import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserRole, SessionUser } from "@/types";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Mock users for demo (no database required)
const MOCK_USERS = [
  {
    id: "1",
    email: "admin@metapharsic.com",
    password: "admin123",
    name: "System Administrator",
    role: "ADMIN" as UserRole,
    image: null,
    practitionerId: null,
    patientId: null,
    organizationId: "1",
  },
  {
    id: "2",
    email: "physician@metapharsic.com",
    password: "physician123",
    name: "Dr. Sarah Johnson",
    role: "PHYSICIAN" as UserRole,
    image: null,
    practitionerId: "1",
    patientId: null,
    organizationId: "1",
  },
  {
    id: "3",
    email: "nurse@metapharsic.com",
    password: "nurse123",
    name: "Emily Rodriguez",
    role: "NURSE" as UserRole,
    image: null,
    practitionerId: "2",
    patientId: null,
    organizationId: "1",
  },
  {
    id: "4",
    email: "frontdesk@metapharsic.com",
    password: "frontdesk123",
    name: "Front Desk Staff",
    role: "FRONT_DESK" as UserRole,
    image: null,
    practitionerId: null,
    patientId: null,
    organizationId: "1",
  },
];

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("Auth attempt with:", credentials?.email);
          const validated = credentialsSchema.parse(credentials);
          console.log("Validated:", validated.email);

          // 1. First check PostgreSQL database
          try {
            const dbUser = await db.user.findUnique({
              where: { email: validated.email },
              include: { practitioner: true, patient: true },
            });

            if (dbUser && dbUser.isActive && dbUser.password) {
              const isPasswordValid = await bcrypt.compare(
                validated.password,
                dbUser.password
              );

              if (isPasswordValid) {
                console.log("Database user authenticated:", dbUser.name);
                return {
                  id: dbUser.id,
                  email: dbUser.email,
                  name: dbUser.name,
                  role: dbUser.role as UserRole,
                  image: dbUser.image,
                  practitionerId: dbUser.practitionerId,
                  patientId: dbUser.patientId,
                  organizationId: dbUser.organizationId,
                } as any;
              }
            }
          } catch (dbErr) {
            console.warn("Database auth check fallback:", dbErr);
          }

          // 2. Fallback to Mock user
          const user = MOCK_USERS.find(
            (u) => u.email === validated.email && u.password === validated.password
          );

          if (!user) {
            console.log("User not found or password mismatch");
            return null;
          }

          console.log("User found from mock list:", user.name);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
            practitionerId: user.practitionerId,
            patientId: user.patientId,
            organizationId: user.organizationId,
          } as any;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
        token.practitionerId = (user as any).practitionerId;
        token.patientId = (user as any).patientId;
        token.organizationId = (user as any).organizationId;
      }

      // Handle session updates
      if (trigger === "update" && session) {
        token.name = session.name;
        token.image = session.image;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any) = {
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          role: token.role as UserRole,
          image: (token.picture as string) || null,
        };
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(`User ${user.email} signed in`);
    },
    async signOut({ token }) {
      console.log(`User ${token.email} signed out`);
    },
  },
};

// Helper functions removed - using mock auth for demo
