import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function SelectUser({
    defaultUser,
    users = [],
    onUserChange,
}: {
    defaultUser: string;
    users: { id: string; firstname: string, lastname: string }[];
    onUserChange: (value: string) => void;
}) {
    return (
        <Select onValueChange={onUserChange} defaultValue={defaultUser}>
            <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Utilisateurs" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Utilisateurs</SelectLabel>
                    { users!.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                            {user.firstname} {user.lastname}
                        </SelectItem>
                    )) }
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
