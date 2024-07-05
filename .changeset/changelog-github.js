/**
 * @see https://github.com/changesets/changesets/blob/main/docs/modifying-changelog-format.md
 */
const { getInfo, getInfoFromPullRequest } = require('@changesets/get-github-info');

const CHANGELOG_PACKAGE_SCOPE = 'tonic-ui';
const CHANGELOG_PACKAGE_NAME = 'changelog-github';

const validate = (options) => {
	if (!options?.repo) {
		throw new Error(
      `Please provide a repo to this changelog generator like this:\n"changelog": ["@${CHANGELOG_PACKAGE_SCOPE}/${CHANGELOG_PACKAGE_NAME}", { "repo": "org/repo" }]`
		);
	}
};

// Example:
// ```
// - Updated dependencies [<commit>]:
//   - @scope/package-1@x.y.z
//   - @scope/package-2@x.y.z
// ```
const getDependencyReleaseLine = async (changesets, dependenciesUpdated, options) => {
  validate(options);

  if (dependenciesUpdated.length === 0) {
    return '';
  }

  const repo = options?.repo;
  const changesetCommits = await Promise.all(
    changesets.map(async (cs) => {
      if (cs.commit) {
        const info = await getInfo({
          repo: repo,
          commit: cs.commit,
        });
        return info?.links?.commit;
      }
      return null;
    })
  ).filter(Boolean);

  const changesetLink = `- Updated dependencies [${changesetCommits.join(', ')}]`;
  const updatedDependenciesList = dependenciesUpdated.map(
    (dependency) => `  - ${dependency.name}@${dependency.newVersion}`
  );

  return [changesetLink, ...updatedDependenciesList].join('\n');
};

// Example:
// ```
// \n
// \n
// - feat: enhance something by @user in #123
// ```
const getReleaseLine = async (changeset, type, options) => {
  validate(options);

  const repo = options?.repo;
  let prFromSummary = 0;
  let commitFromSummary = '';
  const usersFromSummary = [];

  const replacedChangelog = changeset.summary
    .replace(/^\s*(?:pr|pull|pull\s+request):\s*#?(\d+)/im, (_, pr) => {
      if (pr) {
        prFromSummary = Number(pr) || 0;
      }
      return '';
    })
    .replace(/^\s*commit:\s*([^\s]+)/im, (_, commit) => {
      commitFromSummary = commit;
      return '';
    })
    .replace(/^\s*(?:author|user):\s*@?([^\s]+)/gim, (_, user) => {
      usersFromSummary.push(user);
      return '';
    })
    .trim();

  const [firstLine, ...futureLines] = replacedChangelog
    .split('\n')
    .map((l) => l.trimRight());

  const links = await (async () => {
    if (prFromSummary > 0) {
      const pullRequestInfo = await getInfoFromPullRequest({
        repo: repo,
        pull: prFromSummary,
      });
      const links = pullRequestInfo.links;
      if (commitFromSummary) {
        const shortCommitId = commitFromSummary.slice(0, 7);
        return {
          ...links,
          commit: `[\`${shortCommitId}\`](https://github.com/${repo}/commit/${commitFromSummary})`,
        };
      }
      return links;
    }

    const commitToFetchFrom = commitFromSummary || changeset.commit;
    if (commitToFetchFrom) {
      const info = await getInfo({
        repo: repo,
        commit: commitToFetchFrom,
      });
      return info.links;
    }

    return {
      commit: null,
      pull: null,
      user: null,
    };
  })();

  const users = usersFromSummary.length > 0
    ? usersFromSummary.map((userFromSummary) => {
        return `[@${userFromSummary}](https://github.com/${userFromSummary})`;
      })
    : links.user ? [links.user] : [];

  const byUsers = (users && users.length > 0) ? ` by ${users.join(', ')}` : '';

  // Only link PR or merge commit not both
  const linkPullOrCommit = (() => {
    if (links.pull) {
      return ` in ${links.pull}`;
    }
    if (links.commit) {
      return ` in ${links.commit}`;
    }
    return '';
  })();

  const prefix = '';
  const suffix = `${byUsers}${linkPullOrCommit}`;

  return `\n\n- ${prefix}${firstLine}${suffix}\n${futureLines.map((l) => `  ${l}`).join('\n')}`;
};

const changelogFunctions = {
  getDependencyReleaseLine,
  getReleaseLine,
};

module.exports = changelogFunctions;
