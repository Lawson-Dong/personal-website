# Private website inbox

Messages are stored as issues in a **private** repository owned by Lawson-Dong. There is no public read endpoint; successful submissions return only `{ "ok": true }`. The server verifies that the destination repository is private and has issues enabled before each write. An unconfigured or public destination fails closed.

## Deployment configuration

1. Create a private repository, for example `Lawson-Dong/website-messages`, with Issues enabled.
2. Create a fine-grained GitHub personal access token restricted to this repository, with **Issues: Read and write** and the automatically included **Metadata: Read** permission. No Contents permission is needed. Keep the token secret.
3. In Vercel → lawson-dong → Settings → Environment Variables, add:
   - `MESSAGES_GITHUB_REPO` = the exact `Lawson-Dong/repository-name`.
   - `MESSAGES_GITHUB_TOKEN` = the token; mark it sensitive, server only, production scope. Never prefix it with `NEXT_PUBLIC_`.
4. Redeploy. Send a test note from `/message`, verify it appears in the private repository’s Issues, and verify an unauthenticated visitor cannot read the repository.

Only repository collaborators and authorized GitHub apps can read its issues. Do not grant public access. Submissions include only the optional name, subject, message, and receipt timestamp; the API does not store IP addresses in GitHub. In-memory request throttling is an abuse deterrent per running function instance, not a global distributed limit. Configure provider-level rate limiting for heavier traffic.

Until configured, the editor remains usable and returns a truthful “not connected” message without clearing the draft. Markdown previews ignore HTML and do not load remote images.
