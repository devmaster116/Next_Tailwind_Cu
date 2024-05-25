import Link from "next/link";
import React from "react";

const Home = () => {
  return (
    <div>
      <main>Swifti</main>
      <Link href="/business-login">Login</Link>
      <br />
      <Link href="/statistics">Stats</Link>
    </div>
  );
};

export default Home;
