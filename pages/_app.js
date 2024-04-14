import Navbar from "../components/NavBar";
import "../styles/globals.css";
import Footer from "../components/Footer"

function MyApp({ Component, pageProps }) {
  return (
    <div style={{ backgroundColor: "#06436B", border: 4 }}>
      <Navbar />
      <Component {...pageProps} />
      <Footer/>
    </div>
  );
}

export default MyApp;
