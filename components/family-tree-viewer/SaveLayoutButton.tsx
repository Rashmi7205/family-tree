import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Save, RotateCcw } from "lucide-react";
import { ButtonLoader } from "@/components/ui/loader";

interface SaveLayoutButtonProps {
  onSave: () => void;
  onReset: () => void;
  isUsingCustomPositions: boolean;
  savingPositions: boolean;
  disabled?: boolean;
}

export const SaveLayoutButton: FC<SaveLayoutButtonProps> = ({
  onSave,
  onReset,
  isUsingCustomPositions,
  savingPositions,
  disabled = false,
}) => {
  return (
    <div className="flex gap-2">
      {/* Save Button - Icon only on desktop */}
      <Button
        onClick={onSave}
        disabled={disabled || savingPositions}
        size="icon"
        className="h-10 w-10 min-w-[44px] min-h-[44px] bg-green-600 hover:bg-green-700 text-white hidden md:flex"
        title="Save Layout"
      >
        {savingPositions ? (
          <ButtonLoader size="sm" />
        ) : (
          <Save className="h-5 w-5" />
        )}
      </Button>

      {/* Save Button - With text on mobile */}
      <Button
        onClick={onSave}
        disabled={disabled || savingPositions}
        size="sm"
        className="bg-green-600 hover:bg-green-700 text-white md:hidden"
      >
        {savingPositions ? (
          <ButtonLoader size="sm" />
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            Save Layout
          </>
        )}
      </Button>

      {/* Reset Button - Icon only on desktop */}
      {isUsingCustomPositions && (
        <Button
          onClick={onReset}
          disabled={disabled || savingPositions}
          size="icon"
          variant="outline"
          className="h-10 w-10 min-w-[44px] min-h-[44px] border-orange-300 text-orange-700 hover:bg-orange-50 hidden md:flex"
          title="Reset to Auto Layout"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
      )}

      {/* Reset Button - With text on mobile */}
      {isUsingCustomPositions && (
        <Button
          onClick={onReset}
          disabled={disabled || savingPositions}
          size="sm"
          variant="outline"
          className="border-orange-300 text-orange-700 hover:bg-orange-50 md:hidden"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset to Auto
        </Button>
      )}
    </div>
  );
};
