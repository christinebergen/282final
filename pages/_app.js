import Navbar from "../components/NavBar";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <div style={{ backgroundColor: "#06436B", border: 4 }}>
      <Navbar />
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
