"use client";

import { useEffect, useState, useRef } from "react";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { useUserContext } from "@/app/context/Userinfo";
import Timeline_roadmap_function from "./Timeline_roadmap";
import { MultiStepLoader } from "./ui/multi-step-loader";
import { motion } from "framer-motion";
import SearchAssistant from "@/components/SearchAssistant";
import { useToast } from "@/hooks/use-toast";

function MainInput() {
  const [inputValue, setInputValue] = useState("");
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [triggerSearch, setTriggerSearch] = useState(false); // New state to trigger search

  const { contextemail, contextisLoggedIn, contextsetRoadmap, contextsetFirstRoadmap } = useUserContext();
  const searchAssistantRef = useRef(null);
  const { toast } = useToast();

  const MODEL_API_SERVER = process.env.NEXT_PUBLIC_MODEL_API_SERVER;

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };


  return (
    <div className="max-w-4xl mx-auto w-full px-4">
      {loading && (
        <div className="fixed inset-0 z-50">
          <MultiStepLoader
            loadingStates={loadingStates}
            loading={loading}
            duration={1000}
            loop={true}
          />
        </div>
      )}

      {roadmapData && !loading && (
        <div className="mt-8 w-full p-6 rounded-xl page-transition">
          <Timeline_roadmap_function roadmapData={roadmapData} />
        </div>
      )}

      <SearchAssistant ref={searchAssistantRef} onPromptAccept={handleSuggestedPrompt} />
    </div>
  );
}

export default MainInput;