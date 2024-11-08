// styles/globalStyles.js
import { css } from "@emotion/react";

export const globalStyles = css`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    font-family: "Nunito", sans-serif;
    background-color: var(--primary-color);
    color: var(--text-color);
    line-height: 1.5;
  }
  a {
    text-decoration: none;
    color: var(--accent-color);
    transition: color 0.3s ease;

    &:hover {
      color: #00a896; // A lighter shade for hover effect
    }
  }
`;
