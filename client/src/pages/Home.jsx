import Header from "../components/Header"
import Navbar from "../components/Navbar"

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-600">
      <Navbar />
      <Header />
    </div>
  )
}

export default Home