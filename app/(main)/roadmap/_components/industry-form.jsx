// "use client";

// import { useState, useTransition } from "react";
// import { saveRoadMap } from "@/actions/road-map";

// export default function IndustryForm() {
//   const [industry, setIndustry] = useState("");
//   const [isPending, startTransition] = useTransition();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!industry) return;
//     startTransition(async () => {
//       await saveRoadMap(industry);
//       window.location.reload(); // refresh to show roadmap
//     });
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="max-w-md mx-auto bg-neutral-900 p-6 rounded-xl text-white"
//     >
//       <h2 className="text-xl font-bold mb-4">Select Your Industry</h2>

//       <select
//         className="w-full p-3 rounded bg-neutral-800 border border-gray-700"
//         value={industry}
//         onChange={(e) => setIndustry(e.target.value)}
//       >
//         <option value="">-- Choose Industry --</option>
//         <option value="Software Development">Software Development</option>
//         <option value="Data Science">Data Science</option>
//         <option value="Cybersecurity">Cybersecurity</option>
//         <option value="AI & ML">AI & Machine Learning</option>
//         <option value="Networking">Networking</option>
//         <option value="Cloud Computing">Cloud Computing</option>
//         <option value="UI/UX Design">UI/UX Design</option>
//       </select>

//       <button
//         type="submit"
//         disabled={isPending}
//         className="mt-4 w-full bg-yellow-500 text-black py-2 rounded-lg font-semibold hover:bg-yellow-400"
//       >
//         {isPending ? "Generating Roadmap..." : "Generate Roadmap"}
//       </button>
//     </form>
//   );
// }
