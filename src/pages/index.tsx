import type { NextPage } from 'next';
import { FormEvent, useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import styles from "../styles/home.module.css";

const Home: NextPage = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {isAuth, signIn} = useContext(AuthContext);
  
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
        <button type="submit">Enviar</button>
      </form>
    </div>
  )
}

export default Home
