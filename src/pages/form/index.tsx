
import { type NextPage } from "next";
import React from "react";
import { api } from "~/utils/api";
import { useUser } from '@clerk/clerk-react';
import UserSkills from "~/components/UserSkills";
import RecFormComponent from "~/components/Form";

const FormPage: NextPage = () => {
    const { user } = useUser();
    const userId = user?.id ?? '';
    return (
        <div className="bg-stitched-black p-5 md:px-20">
            {/* <RecFormComponent userId={userId} /> */}
            <UserSkills userId={userId}></UserSkills>
        </div>
    )
}

export default FormPage;