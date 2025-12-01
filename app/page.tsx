import BirthdayRegistrationForm from "@/components/birthday-registration-form"

export default function Home() {
  return (
    <main className="h-screen flex overflow-hidden">
      {/* Left Side - Form with mobile background only */}
      <div className="w-full lg:w-1/2 h-full overflow-y-auto scrollbar-hide relative">
        {/* Background with overlay for mobile */}
        <div 
          className="absolute inset-0 [background-image:url('/background.png')] bg-cover bg-center bg-no-repeat lg:[background-image:none] pointer-events-none"
          style={{ minHeight: '100%' }}
        >
          <div className="absolute inset-0 bg-black/75 lg:hidden" />
        </div>
        
        {/* Form content */}
        <div className="w-full relative z-10 p-4 sm:p-8">
          <BirthdayRegistrationForm />
        </div>
      </div>

      {/* Right Side - Background Image (Desktop only) */}
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
