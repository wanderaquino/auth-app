import type { NextPage, NextPageContext } from 'next';
import { FormEvent, useContext, useState } from 'react';
import { GetServerSideProps } from 'next';
import { AuthContext } from '../context/AuthContext';
import styles from "../styles/home.module.css";
import { withSSRGuest } from '../utils/withSSRGuest';

const Home: NextPage = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {signIn} = useContext(AuthContext);
  
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const data = {email, password};
    signIn(data);
  }

  return (
    <div className={styles.landing}>
      <form onSubmit={handleSubmit} className={styles.container}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} name="email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}name="password" />
        <button type="submit">Entrar</button>
      </form>
    </div>
  )
}

export default Home;

export const getServerSideProps: GetServerSideProps = withSSRGuest(
  async (context) => {
  return {
    props: {}
  }
})