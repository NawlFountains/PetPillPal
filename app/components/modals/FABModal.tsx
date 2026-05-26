import { View } from "react-native";
import CreateAnimalModal from "./CreateAnimalModal";
import CreateMedicationScheduleModal from "./CreateMedicationScheduleModal";
import CreateFamilyModal from "./CreateFamilyModal";
import JoinFamilyModal from "./JoinFamilyModal";
import { useState } from "react";
import FABMenu from "../ui/FABMenu";

export default function FABModals() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [showCreateAnimal, setShowCreateAnimal] = useState(false)
    const [showCreateMedicationSchedule, setShowCreateMedicationSchedule] = useState(false)
    const [showCreateFamily, setShowCreateFamily] = useState(false)
    const [showJoinFamily, setShowJoinFamily] = useState(false)
    
    return (
        <View>
            <CreateAnimalModal
                visible={showCreateAnimal}
                onClose={() => setShowCreateAnimal(false)}/>   
            <CreateMedicationScheduleModal
                visible={showCreateMedicationSchedule}
                onClose={() => setShowCreateMedicationSchedule(false)}/>
            <CreateFamilyModal
                visible={showCreateFamily}
                onClose={() => setShowCreateFamily(false)}/>
            <JoinFamilyModal
                visible={showJoinFamily}
                onClose={() => setShowJoinFamily(false)}/>
            <FABMenu
                open={menuOpen}
                onToggle={() => setMenuOpen(!menuOpen)}
                items={[
                { label: 'Add animal', onPress: () => { setShowCreateAnimal(true); setMenuOpen(false) } },
                { label: 'Add medication schedule', onPress: () => { setShowCreateMedicationSchedule(true); setMenuOpen(false) } },
                { label: 'Create a family', onPress: () => { setShowCreateFamily(true); setMenuOpen(false) } },
                { label: 'Join a family', onPress: () => { setShowJoinFamily(true); setMenuOpen(false) } },
                ]}
            />
        </View>
    )
}