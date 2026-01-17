import type {PsychologistProfile} from "@types.ts"
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const MyProfilePage = () => {
    const [profile, setProfile] = useState<PsychologistProfile | null>(null);
    const [originalProfile, setOriginalProfile] = useState<PsychologistProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetch("http://localhost:8000/api/accounts/psychologist/", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
        })
            .then(res => res.json())
            .then(data => {
                setProfile(data);
                setOriginalProfile(data);
            });
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if (!profile) return;
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleCancel = () => {
        setProfile(originalProfile);
        setIsEditing(false);
    };

    const handleSave = () => {
        setOriginalProfile(profile);
        setIsEditing(false);
    };

    if (!profile) return null;

    return (
        <main className="pt-28 pb-10 flex justify-center">
            <Card className="w-full max-w-2xl bg-gray-800 text-logo-color border-logo-color">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-logo-color">
                        My Profile
                    </CardTitle>

                    {!isEditing && (
                        <Button
                            className="bg-logo-color text-gray-800 hover:opacity-70 cursor-pointer"
                            variant="outline"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit
                        </Button>
                    )}
                </CardHeader>

                <CardContent className="space-y-4">
                    <div>
                        <Label>Username</Label>
                        <Input value={profile.user.username} disabled />
                    </div>

                    <div>
                        <Label>Email</Label>
                        <Input value={profile.user.email} disabled />
                    </div>

                    <div>
                        <Label>First name</Label>
                        <Input
                            name="first_name"
                            value={profile.first_name}
                            disabled={!isEditing}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <Label>Last name</Label>
                        <Input
                            name="last_name"
                            value={profile.last_name}
                            disabled={!isEditing}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <Label>Phone number</Label>
                        <Input
                            name="phone_number"
                            value={profile.phone_number}
                            disabled={!isEditing}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <Label>Specialization</Label>
                        <Input
                            name="specialization"
                            value={profile.specialization}
                            disabled={!isEditing}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <Label>License number</Label>
                        <Input value={profile.license_number} disabled />
                    </div>

                    <div>
                        <Label>Notes</Label>
                        <Textarea
                            name="notes"
                            value={profile.notes || ""}
                            disabled={!isEditing}
                            onChange={handleChange}
                        />
                    </div>

                    {isEditing && (
                        <div className="flex gap-3 pt-4">
                            <Button
                                onClick={handleSave}
                                className="hover:opacity-70 cursor-pointer bg-logo-color "
                            >
                                Save
                            </Button>
                            <Button
                                className=" hover:opacity-70 cursor-pointer"
                                variant="outline"
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </main>
    );
};

export default MyProfilePage;
