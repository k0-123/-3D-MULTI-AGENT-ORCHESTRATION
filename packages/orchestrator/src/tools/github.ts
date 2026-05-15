import { Octokit } from "@octokit/rest";

let GITHUB_OWNER = process.env.GITHUB_OWNER || "k0-123";
let GITHUB_REPO = process.env.GITHUB_REPO || "agent-flow";

export async function githubAction(action: "list" | "read" | "commit" | "pr", params: any): Promise<string> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return "GitHub token missing. Please add GITHUB_TOKEN to .env";

  const octokit = new Octokit({ auth: token });
  const owner = GITHUB_OWNER;
  const repo = GITHUB_REPO;

  try {
    if (action === "list") {
      const { data } = await octokit.repos.getContent({ owner, repo, path: params.path || "" });
      if (Array.isArray(data)) {
        return data.map(f => `${f.type === "dir" ? "[DIR]" : "[FILE]"} ${f.path}`).join("\n");
      }
      return "Path is not a directory.";
    }

    if (action === "read") {
      const { data }: any = await octokit.repos.getContent({ owner, repo, path: params.path });
      return Buffer.from(data.content, "base64").toString();
    }

    if (action === "commit") {
      // Step 1: Get current ref
      const { data: ref } = await octokit.git.getRef({ owner, repo, ref: "heads/main" });
      const baseSha = ref.object.sha;

      // Step 2: Create new branch
      const branchName = `agent-update-${Date.now()}`;
      await octokit.git.createRef({ owner, repo, ref: `refs/heads/${branchName}`, sha: baseSha });

      // Step 3: Create commit
      await octokit.repos.createOrUpdateFileContents({
        owner, repo,
        path: params.path,
        message: params.message || "Automated update from Agent Orchestrator",
        content: Buffer.from(params.content).toString("base64"),
        branch: branchName,
      });

      // Step 4: Create PR
      const { data: pr } = await octokit.pulls.create({
        owner, repo,
        title: `Agent Update: ${params.path}`,
        head: branchName,
        base: "main",
        body: `Automated PR from Agent Orchestrator.\n\nChanges to: ${params.path}`,
      });

      return `PR created: ${pr.html_url}`;
    }

    if (action === "pr") {
       // Logic for listing PRs or other PR actions could go here
       return "PR action requested but not fully implemented in githubAction helper.";
    }

    return `Unknown action: ${action}`;
  } catch (err: any) {
    return `GitHub Error: ${err.message || String(err)}`;
  }
}
