import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const genders = ["Male", "Female", "Other"]

const SelectGender = ({ gender, setGender }) => {
  return (
    <div>
      <label htmlFor="gender" className="px-1 text-muted-foreground text-xs">
        Gender
      </label>
      <Select value={gender} onValueChange={setGender} name="gender">
        <SelectTrigger>
          <SelectValue placeholder="Select gender" />
        </SelectTrigger>
        <SelectContent className="bg-card">
          {genders.map((g) => (
            <SelectItem key={g} value={g}>
              {g}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default SelectGender
