/**
 * @see https://github.com/changesets/changesets/blob/main/docs/modifying-changelog-format.md
 */

import { ChangelogFunctions } from '@changesets/types';
import { getInfo, getInfoFromPullRequest } from '@changesets/get-github-info';

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
  };

  const repo = options?.repo;
  const changesetCommits = await Promise.all(
    changesets.map(async (cs) => {
      if (cs.commit) {
        const { links } = await getInfo({
          repo: repo,
          commit: cs.commit,
        });
        return links.commit;
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
// - feat: add something by @user in #123
// ```
const getReleaseLine = async (changeset, type, options) => {
  validate(options);

  const repo = options?.repo;
  let prFromSummary; // number
  let commitFromSummary; // string
  let usersFromSummary = []; // array

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
      const { links } = await getInfoFromPullRequest({
        repo: repo,
        pull: prFromSummary,
      });
      if (commitFromSummary) {
        const shortCommitId = commitFromSummary.slice(0, 7);
        links = {
          ...links,
          commit: `[\`${shortCommitId}\`](https://github.com/${repo}/commit/${commitFromSummary})`,
        };
      }
      return links;
    }

    const commitToFetchFrom = commitFromSummary || changeset.commit;
    if (commitToFetchFrom) {
      const { links } = await getInfo({
        repo: repo,
        commit: commitToFetchFrom,
      });
      return links;
    }

    return {
      commit: null,
      pull: null,
      user: null,
    };
  })();

  const users = usersFromSummary.length > 0
    ? usersFromSummary.map((userFromSummary) => (
        `[@${userFromSummary}](https://github.com/${userFromSummary})`
      )).join(' ,')
    : Array(links.user).filter(Boolean);

  const byUsers = (users && users.length > 0) ? '' : ` by ${users}`;

  // only link PR or merge commit not both
  const linkPullOrCommit = (() => {
    if (links.pull) {
      return ` in ${links.pull}`;
    }
    if (links.commit) {
      return ` in ${links.commit}`;
    }
    return '';
  })();

  const suffix = `${byUser}${linkPullOrCommit}`;

  return `\n\n- ${firstLine}${suffix}\n${futureLines.map((l) => `  ${l}`).join('\n')}`;
};

const changelogFunctions = {
  getDependencyReleaseLine,
  getReleaseLine,
};

export default changelogFunctions;
