// 'use client';

// import * as React from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { cn } from "@/lib/utils";
// import Image from "next/image";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { teamMembers } from "@/lib/data"; // ✅ Import directly from your data file

// const TeamSection = React.forwardRef<HTMLDivElement>((_, ref) => {
//   const [currentIndex, setCurrentIndex] = React.useState(0);
//   const total = teamMembers.length;

//   // ✅ Auto-slide every 5 seconds
//   React.useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prev) => (prev + 1) % total);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [total]);

//   // ✅ Manual navigation
//   const handleNext = () => setCurrentIndex((prev) => (prev + 1) % total);
//   const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + total) % total);

//   // ✅ Get 3 visible team members
//   const visibleMembers = [
//     teamMembers[currentIndex % total],
//     teamMembers[(currentIndex + 1) % total],
//     teamMembers[(currentIndex + 2) % total],
//   ].filter(Boolean);

//   // ✅ Animation Variants
//   const slideVariants = {
//     enter: { opacity: 0, x: 100 },
//     center: { opacity: 1, x: 0 },
//     exit: { opacity: 0, x: -100 },
//   };

//   return (
//     <section
//       id="team"
//       ref={ref}
//       className={cn("w-full py-20 lg:py-28 bg-secondary relative overflow-hidden")}
//     >
//       {/* Header */}
//       <div className="container mx-auto flex flex-col items-center text-center px-4">
//         <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-3 font-headline">
//           Meet Our Team
//         </h2>
//         <p className="max-w-3xl text-muted-foreground md:text-xl">
//           The passionate minds driving innovation and creativity at Patel Pulse Ventures.
//         </p>
//       </div>

//       {/* Arrows */}
//       <div className="absolute top-[60%] left-[6%] z-20 transform -translate-y-1/2">
//         <button
//           onClick={handlePrev}
//           className="p-2 rounded-full bg-background/80 shadow hover:bg-primary hover:text-white transition"
//         >
//           <ChevronLeft className="h-6 w-6" />
//         </button>
//       </div>
//       <div className="absolute top-[60%] right-[6%] z-20 transform -translate-y-1/2">
//         <button
//           onClick={handleNext}
//           className="p-2 rounded-full bg-background/80 shadow hover:bg-primary hover:text-white transition"
//         >
//           <ChevronRight className="h-6 w-6" />
//         </button>
//       </div>

//       {/* Slider */}
//       <div className="relative mt-12 md:mt-20 max-w-6xl mx-auto overflow-hidden">
//         <AnimatePresence mode="wait">
//   <motion.div
//     key={currentIndex}
//     initial={{ opacity: 0, x: 50 }}
//     animate={{ opacity: 1, x: 0 }}
//     exit={{ opacity: 0, x: -50 }}
//     transition={{ duration: 0.6, ease: "easeInOut" }}
//     className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6"
//   >

//             {visibleMembers.map((member, index) => (
//               <motion.div
//                 key={member.id}
//                 whileHover={{ y: -8 }}
//                 transition={{ type: "spring", stiffness: 300 }}
//                 className="group overflow-hidden"
//               >
//                 <div className="relative">
//                   <Image
//                     className="h-96 w-full rounded-md object-cover object-top grayscale transition-all duration-500 hover:grayscale-0 group-hover:h-[22.5rem] group-hover:rounded-xl"
//                     src={member.avatar}
//                     alt={member.name}
//                     width={826}
//                     height={1239}
//                   />
//                 </div>
//                 <div className="px-2 pt-2 sm:pb-0 sm:pt-4">
//                   <div className="flex justify-between">
//                     <h3 className="text-title text-base font-medium transition-all duration-500 group-hover:tracking-wider">
//                       {member.name}
//                     </h3>
//                     <span className="text-xs">_0{index + 1}</span>
//                   </div>
//                   <div className="mt-1 flex items-center justify-between">
//                     <span className="text-muted-foreground inline-block translate-y-6 text-sm opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
//                       {member.role}
//                     </span>
//                     {member.link && (
//                       <a
//                         href={member.link}
//                         className="group-hover:text-primary inline-block translate-y-8 text-sm tracking-wide opacity-0 transition-all duration-500 hover:underline group-hover:translate-y-0 group-hover:opacity-100"
//                       >
//                         Patel Pulse Venture
//                       </a>
//                     )}
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </motion.div>
//         </AnimatePresence>
//       </div>
//     </section>
//   );
// });

// TeamSection.displayName = "TeamSection";
// export default TeamSection;

'use client';

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { teamMembers } from "@/lib/data"; // ✅ Import directly from your data file

const TeamSection = React.forwardRef<HTMLDivElement>((_, ref) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const total = teamMembers.length;

  // ✅ Auto-slide every 5 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 5000);
    return () => clearInterval(interval);
  }, [total]);

  // ✅ Manual navigation
  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % total);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + total) % total);

  // ✅ Get 3 visible team members
  const visibleMembers = [
    teamMembers[currentIndex % total],
    teamMembers[(currentIndex + 1) % total],
    teamMembers[(currentIndex + 2) % total],
  ].filter(Boolean);

  // ✅ Animation Variants
  const slideVariants = {
    enter: { opacity: 0, x: 100 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  return (
    <section
      id="team"
      ref={ref}
      className={cn("w-full py-20 lg:py-28 bg-secondary relative overflow-hidden")}
    >
      {/* Header */}
      <div className="container mx-auto flex flex-col items-center text-center px-4">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-3 font-headline">
          Meet Our Team
        </h2>
        <p className="max-w-3xl text-muted-foreground md:text-xl">
          The passionate minds driving innovation and creativity at Patel Pulse Ventures.
        </p>
      </div>

      {/* Arrows */}
      <div className="absolute top-[60%] left-[6%] z-20 transform -translate-y-1/2">
        <button
          onClick={handlePrev}
          className="p-2 rounded-full bg-background/80 shadow hover:bg-primary hover:text-white transition"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      </div>
      <div className="absolute top-[60%] right-[6%] z-20 transform -translate-y-1/2">
        <button
          onClick={handleNext}
          className="p-2 rounded-full bg-background/80 shadow hover:bg-primary hover:text-white transition"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Slider */}
      <div className="relative mt-12 md:mt-20 max-w-6xl mx-auto overflow-hidden">
        <AnimatePresence mode="wait">
  <motion.div
    key={currentIndex}
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
    transition={{ duration: 0.6, ease: "easeInOut" }}
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6"
  >

            {visibleMembers.map((member, index) => (
              <motion.div
                key={member.id}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="group overflow-hidden"
              >
                <div className="relative">
                  <Image
                    className="h-96 w-full rounded-md object-cover object-top grayscale transition-all duration-500 hover:grayscale-0 group-hover:h-[22.5rem] group-hover:rounded-xl"
                    src={member.avatar}
                    alt={member.name}
                    width={826}
                    height={1239}
                  />
                </div>
                <div className="px-2 pt-2 sm:pb-0 sm:pt-4">
                  <div className="flex justify-between">
                    <h3 className="text-title text-base font-medium transition-all duration-500 group-hover:tracking-wider">
                      {member.name}
                    </h3>
                    <span className="text-xs">_0{index + 1}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-muted-foreground inline-block translate-y-6 text-sm opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      {member.role}
                    </span>
                    {member.link && (
                      <a
                        href={member.link}
                        className="group-hover:text-primary inline-block translate-y-8 text-sm tracking-wide opacity-0 transition-all duration-500 hover:underline group-hover:translate-y-0 group-hover:opacity-100"
                      >
                        Patel Pulse Venture
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
});

TeamSection.displayName = "TeamSection";
export default TeamSection;
