import CampaignCarousel from "@/components/CampaignCarousel";
import { Campaign } from "@/types/campaign";

type Props = {
    campaigns: Campaign[];
};
export default function Home({ campaigns }: Props) {
    return <CampaignCarousel campaigns={campaigns}></CampaignCarousel>;
}
