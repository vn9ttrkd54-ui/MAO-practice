import TrainerClient from "./TrainerClient";
import { getTrainerItems } from "@/lib/trainerCatalog";

export default function TrainerPage() {
  return <TrainerClient items={getTrainerItems()} />;
}
