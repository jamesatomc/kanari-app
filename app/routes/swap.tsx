import Navbar from "~/navbar"; // Assuming your Navbar component is in ~/navbar

export default function Swap() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white"> 
      <Navbar isMenuOpen={false} toggleMenu={function (): void {
        throw new Error("Function not implemented.");
      } } /> {/* Add the Navbar component here */}

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-16">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-8">Swap Page</h1>
        {/* Add your swap page content here */}
      </div>
    </div>
  );
}
