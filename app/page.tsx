import { gql } from '@apollo/client';
import Image from 'next/image';
import { getClient } from '../util/apolloClient';
import styles from './page.module.scss';

export type GitHubProfileResponse = {
  user: {
    name: string;
    avatarUrl: string;
    repositories: {
      edges: {
        node: {
          name: string;
          id: string;
          defaultBranchRef: {
            name: string;
          };
        };
      }[];
    };
  };
};

export default async function Home() {
  const { loading, data } = await getClient().query<GitHubProfileResponse>({
    query: gql`
      query GithubProfile($username: String = "karlhorky") {
        user(login: $username) {
          name
          avatarUrl
          repositories(first: 10) {
            edges {
              node {
                name
                id
                defaultBranchRef {
                  name
                }
              }
            }
          }
        }
      }
    `,
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main className={styles.main}>
      <h1>My GitHub Profile</h1>

      <br />
      <br />
      <Image src={data.user.avatarUrl} alt="avatar" width={400} height={400} />
      <h2>I am {data.user.name}</h2>

      <br />

      <strong>
        Listing my first {data.user.repositories.edges.length} Repositories
        below
      </strong>

      <ul>
        {data.user.repositories.edges.map((repo) => {
          return (
            <li key={`${repo.node.name}-${repo.node.id}`}>
              {repo.node.name} / ({repo.node.defaultBranchRef.name})
            </li>
          );
        })}
      </ul>
    </main>
  );
}
