import GithubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      httpOptions: {
        timeout: 10000,
      }
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  }
};
