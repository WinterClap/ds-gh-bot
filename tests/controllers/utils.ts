/* istanbul ignore file */
import { EmbedMessageInterface } from "../../bot/utils/botUtils";
import { Request } from "express";
import {
  getInformationFromRequest,
  getCodeReviewEmbed,
  getJiraTicket,
} from "../../controller/githubCodeReviewWebhook.controller";

export const ticketNumber = "SH-34";
export const PR_invalidTitle = "Invalid PR Title, SH-, SH-asd, SH, sh, sh-, sh-asd, sh-34";
export const PR_validTitle = `Valid Title SH-${ticketNumber}, SH-asd, SH-123, sh-asd, sh-123`;
export const PRBody = "PR Body";

export const baseReq: Partial<Request> = {
  headers: {
    "content-type": "application/json",
  },
  body: {
    action: "created",
    issue: {
      url: "https://api.github.com/repos/WinterClap/share-hub-be/issues/7",
      repository_url: "https://api.github.com/repos/WinterClap/share-hub-be",
      labels_url: "https://api.github.com/repos/WinterClap/share-hub-be/issues/7/labels{/name}",
      comments_url: "https://api.github.com/repos/WinterClap/share-hub-be/issues/7/comments",
      events_url: "https://api.github.com/repos/WinterClap/share-hub-be/issues/7/events",
      html_url: "https://github.com/WinterClap/share-hub-be/pull/7",
      id: 1123454248,
      node_id: "PR_kwDOGuWDws4yC436",
      number: 7,
      title: "PR Title Testing",
      user: {
        login: "WinterClap",
        id: 69702579,
        node_id: "MDQ6VXNlcjY5NzAyNTc5",
        avatar_url: "https://avatars.githubusercontent.com/u/69702579?v=4",
        gravatar_id: "",
        url: "https://api.github.com/users/WinterClap",
        html_url: "https://github.com/WinterClap",
        followers_url: "https://api.github.com/users/WinterClap/followers",
        following_url: "https://api.github.com/users/WinterClap/following{/other_user}",
        gists_url: "https://api.github.com/users/WinterClap/gists{/gist_id}",
        starred_url: "https://api.github.com/users/WinterClap/starred{/owner}{/repo}",
        subscriptions_url: "https://api.github.com/users/WinterClap/subscriptions",
        organizations_url: "https://api.github.com/users/WinterClap/orgs",
        repos_url: "https://api.github.com/users/WinterClap/repos",
        events_url: "https://api.github.com/users/WinterClap/events{/privacy}",
        received_events_url: "https://api.github.com/users/WinterClap/received_events",
        type: "User",
        site_admin: false,
      },
      labels: [],
      state: "open",
      locked: false,
      assignee: null,
      assignees: [],
      milestone: null,
      comments: 2,
      created_at: "2022-02-03T19:08:15Z",
      updated_at: "2022-02-03T19:16:01Z",
      closed_at: null,
      author_association: "OWNER",
      active_lock_reason: null,
      draft: false,
      pull_request: {
        url: "https://api.github.com/repos/WinterClap/share-hub-be/pulls/7",
        html_url: "https://github.com/WinterClap/share-hub-be/pull/7",
        diff_url: "https://github.com/WinterClap/share-hub-be/pull/7.diff",
        patch_url: "https://github.com/WinterClap/share-hub-be/pull/7.patch",
        merged_at: null,
      },
      body: "First PR comment.",
      reactions: {
        url: "https://api.github.com/repos/WinterClap/share-hub-be/issues/7/reactions",
        total_count: 0,
        "+1": 0,
        "-1": 0,
        laugh: 0,
        hooray: 0,
        confused: 0,
        heart: 0,
        rocket: 0,
        eyes: 0,
      },
      timeline_url: "https://api.github.com/repos/WinterClap/share-hub-be/issues/7/timeline",
      performed_via_github_app: null,
    },
    comment: {
      url: "https://api.github.com/repos/WinterClap/share-hub-be/issues/comments/1029315923",
      html_url: "https://github.com/WinterClap/share-hub-be/pull/7#issuecomment-1029315923",
      issue_url: "https://api.github.com/repos/WinterClap/share-hub-be/issues/7",
      id: 1029315923,
      node_id: "IC_kwDOGuWDws49Wh1T",
      user: {
        login: "WinterClap",
        id: 69702579,
        node_id: "MDQ6VXNlcjY5NzAyNTc5",
        avatar_url: "https://avatars.githubusercontent.com/u/69702579?v=4",
        gravatar_id: "",
        url: "https://api.github.com/users/WinterClap",
        html_url: "https://github.com/WinterClap",
        followers_url: "https://api.github.com/users/WinterClap/followers",
        following_url: "https://api.github.com/users/WinterClap/following{/other_user}",
        gists_url: "https://api.github.com/users/WinterClap/gists{/gist_id}",
        starred_url: "https://api.github.com/users/WinterClap/starred{/owner}{/repo}",
        subscriptions_url: "https://api.github.com/users/WinterClap/subscriptions",
        organizations_url: "https://api.github.com/users/WinterClap/orgs",
        repos_url: "https://api.github.com/users/WinterClap/repos",
        events_url: "https://api.github.com/users/WinterClap/events{/privacy}",
        received_events_url: "https://api.github.com/users/WinterClap/received_events",
        type: "User",
        site_admin: false,
      },
      created_at: "2022-02-03T19:16:01Z",
      updated_at: "2022-02-03T19:16:01Z",
      author_association: "OWNER",
      body: "Third code-review request, maybe?",
      reactions: {
        url: "https://api.github.com/repos/WinterClap/share-hub-be/issues/comments/1029315923/reactions",
        total_count: 0,
        "+1": 0,
        "-1": 0,
        laugh: 0,
        hooray: 0,
        confused: 0,
        heart: 0,
        rocket: 0,
        eyes: 0,
      },
      performed_via_github_app: null,
    },
    repository: {
      id: 451249090,
      node_id: "R_kgDOGuWDwg",
      name: "share-hub-be",
      full_name: "WinterClap/share-hub-be",
      private: true,
      owner: {
        login: "WinterClap",
        id: 69702579,
        node_id: "MDQ6VXNlcjY5NzAyNTc5",
        avatar_url: "https://avatars.githubusercontent.com/u/69702579?v=4",
        gravatar_id: "",
        url: "https://api.github.com/users/WinterClap",
        html_url: "https://github.com/WinterClap",
        followers_url: "https://api.github.com/users/WinterClap/followers",
        following_url: "https://api.github.com/users/WinterClap/following{/other_user}",
        gists_url: "https://api.github.com/users/WinterClap/gists{/gist_id}",
        starred_url: "https://api.github.com/users/WinterClap/starred{/owner}{/repo}",
        subscriptions_url: "https://api.github.com/users/WinterClap/subscriptions",
        organizations_url: "https://api.github.com/users/WinterClap/orgs",
        repos_url: "https://api.github.com/users/WinterClap/repos",
        events_url: "https://api.github.com/users/WinterClap/events{/privacy}",
        received_events_url: "https://api.github.com/users/WinterClap/received_events",
        type: "User",
        site_admin: false,
      },
      html_url: "https://github.com/WinterClap/share-hub-be",
      description: "Backend configuration for ShareHub application. Made in Node.js + Express.js using TypeScript.",
      fork: false,
      url: "https://api.github.com/repos/WinterClap/share-hub-be",
      forks_url: "https://api.github.com/repos/WinterClap/share-hub-be/forks",
      keys_url: "https://api.github.com/repos/WinterClap/share-hub-be/keys{/key_id}",
      collaborators_url: "https://api.github.com/repos/WinterClap/share-hub-be/collaborators{/collaborator}",
      teams_url: "https://api.github.com/repos/WinterClap/share-hub-be/teams",
      hooks_url: "https://api.github.com/repos/WinterClap/share-hub-be/hooks",
      issue_events_url: "https://api.github.com/repos/WinterClap/share-hub-be/issues/events{/number}",
      events_url: "https://api.github.com/repos/WinterClap/share-hub-be/events",
      assignees_url: "https://api.github.com/repos/WinterClap/share-hub-be/assignees{/user}",
      branches_url: "https://api.github.com/repos/WinterClap/share-hub-be/branches{/branch}",
      tags_url: "https://api.github.com/repos/WinterClap/share-hub-be/tags",
      blobs_url: "https://api.github.com/repos/WinterClap/share-hub-be/git/blobs{/sha}",
      git_tags_url: "https://api.github.com/repos/WinterClap/share-hub-be/git/tags{/sha}",
      git_refs_url: "https://api.github.com/repos/WinterClap/share-hub-be/git/refs{/sha}",
      trees_url: "https://api.github.com/repos/WinterClap/share-hub-be/git/trees{/sha}",
      statuses_url: "https://api.github.com/repos/WinterClap/share-hub-be/statuses/{sha}",
      languages_url: "https://api.github.com/repos/WinterClap/share-hub-be/languages",
      stargazers_url: "https://api.github.com/repos/WinterClap/share-hub-be/stargazers",
      contributors_url: "https://api.github.com/repos/WinterClap/share-hub-be/contributors",
      subscribers_url: "https://api.github.com/repos/WinterClap/share-hub-be/subscribers",
      subscription_url: "https://api.github.com/repos/WinterClap/share-hub-be/subscription",
      commits_url: "https://api.github.com/repos/WinterClap/share-hub-be/commits{/sha}",
      git_commits_url: "https://api.github.com/repos/WinterClap/share-hub-be/git/commits{/sha}",
      comments_url: "https://api.github.com/repos/WinterClap/share-hub-be/comments{/number}",
      issue_comment_url: "https://api.github.com/repos/WinterClap/share-hub-be/issues/comments{/number}",
      contents_url: "https://api.github.com/repos/WinterClap/share-hub-be/contents/{+path}",
      compare_url: "https://api.github.com/repos/WinterClap/share-hub-be/compare/{base}...{head}",
      merges_url: "https://api.github.com/repos/WinterClap/share-hub-be/merges",
      archive_url: "https://api.github.com/repos/WinterClap/share-hub-be/{archive_format}{/ref}",
      downloads_url: "https://api.github.com/repos/WinterClap/share-hub-be/downloads",
      issues_url: "https://api.github.com/repos/WinterClap/share-hub-be/issues{/number}",
      pulls_url: "https://api.github.com/repos/WinterClap/share-hub-be/pulls{/number}",
      milestones_url: "https://api.github.com/repos/WinterClap/share-hub-be/milestones{/number}",
      notifications_url: "https://api.github.com/repos/WinterClap/share-hub-be/notifications{?since,all,participating}",
      labels_url: "https://api.github.com/repos/WinterClap/share-hub-be/labels{/name}",
      releases_url: "https://api.github.com/repos/WinterClap/share-hub-be/releases{/id}",
      deployments_url: "https://api.github.com/repos/WinterClap/share-hub-be/deployments",
      created_at: "2022-01-23T22:39:52Z",
      updated_at: "2022-01-23T23:24:20Z",
      pushed_at: "2022-02-03T19:08:15Z",
      git_url: "git://github.com/WinterClap/share-hub-be.git",
      ssh_url: "git@github.com:WinterClap/share-hub-be.git",
      clone_url: "https://github.com/WinterClap/share-hub-be.git",
      svn_url: "https://github.com/WinterClap/share-hub-be",
      homepage: null,
      size: 181,
      stargazers_count: 0,
      watchers_count: 0,
      language: "TypeScript",
      has_issues: true,
      has_projects: true,
      has_downloads: true,
      has_wiki: true,
      has_pages: false,
      forks_count: 0,
      mirror_url: null,
      archived: false,
      disabled: false,
      open_issues_count: 1,
      license: null,
      allow_forking: true,
      is_template: false,
      topics: [],
      visibility: "private",
      forks: 0,
      open_issues: 1,
      watchers: 0,
      default_branch: "master",
    },
    sender: {
      login: "WinterClap",
      id: 69702579,
      node_id: "MDQ6VXNlcjY5NzAyNTc5",
      avatar_url: "https://avatars.githubusercontent.com/u/69702579?v=4",
      gravatar_id: "",
      url: "https://api.github.com/users/WinterClap",
      html_url: "https://github.com/WinterClap",
      followers_url: "https://api.github.com/users/WinterClap/followers",
      following_url: "https://api.github.com/users/WinterClap/following{/other_user}",
      gists_url: "https://api.github.com/users/WinterClap/gists{/gist_id}",
      starred_url: "https://api.github.com/users/WinterClap/starred{/owner}{/repo}",
      subscriptions_url: "https://api.github.com/users/WinterClap/subscriptions",
      organizations_url: "https://api.github.com/users/WinterClap/orgs",
      repos_url: "https://api.github.com/users/WinterClap/repos",
      events_url: "https://api.github.com/users/WinterClap/events{/privacy}",
      received_events_url: "https://api.github.com/users/WinterClap/received_events",
      type: "User",
      site_admin: false,
    },
  },
};

export const correctInformationObject: ReturnType<typeof getInformationFromRequest> = {
  author: "WinterClap",
  commentAuthor: "WinterClap",
  pullRequestBody: "First PR comment.",
  pullRequestNumber: 7,
  pullRequestURL: "https://github.com/WinterClap/share-hub-be/pull/7",
  title: "PR Title Testing",
  userImageURL: "https://avatars.githubusercontent.com/u/69702579?v=4",
  triggeringComment: "Third code-review request, maybe?",
  projectIdentifier: "WinterClap/share-hub-be/7",
};
/* istanbul ignore next */
export const correctGeneratedEmbedMessage = ({
  isPRTitleValid,
  hasPRBody,
  forceTitle,
  forceThreadValue,
}: {
  isPRTitleValid: boolean;
  hasPRBody: boolean;
  forceTitle?: string;
  forceThreadValue?: string;
}): ReturnType<typeof getCodeReviewEmbed> => {
  const embed: EmbedMessageInterface = {
    title: forceTitle || isPRTitleValid ? PR_validTitle : PR_invalidTitle,
    description: correctInformationObject.triggeringComment as string,
    type: isPRTitleValid ? "informative" : "error",
    fields: [
      { name: "Author", value: correctInformationObject.author },
      { name: "PR identifier", value: correctInformationObject.projectIdentifier, inline: true },
      {
        name: "Jira issue",
        value:
          forceThreadValue || getJiraTicket(isPRTitleValid ? PR_validTitle : PR_invalidTitle)
            ? `https://share-hub.atlassian.net/browse/${getJiraTicket(PR_validTitle)}`
            : "Invalid Pull Request Title: Missing 'SH-[TicketNumber]' sequence. Please edit your Pull Request and ask for code-review again.",
      },
      { name: "GitHub PR", value: correctInformationObject.pullRequestURL },
    ],
    footer: {
      text: `This code-review request was triggered in PR No.${correctInformationObject.pullRequestNumber} by ${correctInformationObject.commentAuthor}`,
      iconURL: correctInformationObject.userImageURL,
    },
  };
  hasPRBody && embed?.fields?.push({ name: "Thread: ", value: PRBody });
  return embed;
};
