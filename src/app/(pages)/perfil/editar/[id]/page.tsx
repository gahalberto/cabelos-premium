import { EditProfileForm } from "@/components/EditProfileForm";
import ImageUploud from "@/components/ImageUploud";

type ParamsType = {
    params: {
        id: string;
    };
};

const EditProfilePage = ({ params }: ParamsType) => {
    return (
        <div className="container mx-auto px-4 py-14">
            <EditProfileForm profileId={`${params.id}`} />
            <ImageUploud profileId={`${params.id}`} />
        </div>
    )
}

export default EditProfilePage;