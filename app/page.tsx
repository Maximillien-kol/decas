import BirthdayRegistrationForm from "@/components/birthday-registration-form"

export default function Home() {
  return (
    <main className="h-screen flex overflow-hidden">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 h-full overflow-y-auto p-4 sm:p-8 scrollbar-hide">
        <div className="w-full">
          <BirthdayRegistrationForm />
        </div>
      </div>

      {/* Right Side - Background Image */}
      <div 
        className="hidden lg:block lg:w-1/2 h-full bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: 'url("/background.png")',
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>
    </main>
  )
}
