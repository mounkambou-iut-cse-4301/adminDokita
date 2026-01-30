// import React from "react";
// import { Button } from "./../../components/components/ui/button";

// const OnBoardingScreen = () => {
//   return (
//     <div className="flex w-[100%] md:w-[100%]  h-screen items-center justify-center md:flex-row overflow-auto">
//       <div className="flex flex-col w-full md:w-1/3 h-full bg-white ">
//         <div className="flex text-start m-10 ml-6 mb-40">
//           <img
//             src="/logo.png"
//             alt="Logo"
//             className="h-[40px] w-[60px] md:h-[50px] md:w-[75px] cursor-pointer"
//           />
//           <div className="text-3xl  mb-4 md:text-2xl mt-1 md:mt-2">
//             <h3>PSE Task Manager</h3>
//           </div>
//         </div>
//         <div className=" text-center m-20 mb-[30px]">
//           <h1 className="mb-8">
//             <p className="text-orange-300 text-justify text-4xl">
//               Simplifier la gestion de vos tâches avec
//             </p>{" "}
//             <p className="font-medium text-justify text-4xl">PSE CONSULTING</p>
//           </h1>
//           <p className="text-justify text-xxl">
//             Simplifiez le quici de vos projets grâce à une interface intuitive.
//             Collaborez efficacement avec votre équipe pour atteindre vos
//             objectifs.{" "}
//           </p>
//           <div className="flex justify-start">
//             <Button
//               type="submit"
//               className="btn-submit m-8 bg-[rgb(98,67,124)] hover:bg-purple-800 text-white px-10 py-5 rounded-3xl w-60 ml-0">
//               Commencer maintenant
//             </Button>
//           </div>
//         </div>
//         <div className=""></div>
//       </div>
//       <div className="hidden md:block md:w-2/3 h-full">
//         <img
//           src="onboard.png"
//           alt="On boarding screen image"
//           className="h-full w-full object-none bg-white"
//         />
//       </div>
//     </div>
//   );
// };

// export default OnBoardingScreen;

import React from "react";
import { Button } from "./../../components/components/ui/button";

const OnBoardingScreen = () => {
  return (
    <div className="flex flex-col md:flex-row w-[100%] h-screen items-center justify-center overflow-auto">
      <div className="flex flex-col w-full md:w-1/3 h-full bg-white">
        <div className="flex flex-col md:flex-row text-start mt-20 md:m-10 ml-6 items-center  md:mb-40">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-[40px] w-[60px] md:h-[50px] md:w-[75px] cursor-pointer"
          />
          <div className="text-3xl  mb-4 md:text-2xl mt-1 md:mt-2 md:ml-4">
            <h3>Dokita</h3>
          </div>
        </div>
        <div className=" text-center m-20 mb-[30px]">
          <h1 className="mb-8">
            <p className="text-orange-300 text-justify text-2xl lg:text-4xl">
              Simplifier la gestion de vos tâches avec
            </p>{" "}
            <p className="font-medium text-justify text-3xl lg:text-4xl">
              PSE CONSULTING
            </p>
          </h1>
          <p className="text-justify text-xxl">
            Simplifiez le quici de vos projets grâce à une interface intuitive.
            Collaborez efficacement avec votre équipe pour atteindre vos
            objectifs.{" "}
          </p>
          <div className="flex justify-center lg:justify-start">
            <Button
              type="submit"
              className="btn-submit m-8 bg-[rgb(98,67,124)] hover:bg-purple-800 text-white px-6 py-3 md:px-10 md:py-6 rounded-3xl w-full md:w-60 text-sm md:text-base lg:ml-0"
              onClick={() => {
                window.location.href = "/sign-in";
              }}>
              Commencer maintenant
            </Button>
          </div>
        </div>
        <div className=""></div>
      </div>
      <div className="md:block md:w-2/3 h-full">
        <img
          src="onboard.png"
          alt="On boarding screen image"
          className="h-full w-full object-none bg-white"
        />
      </div>
    </div>
  );
};

export default OnBoardingScreen;
