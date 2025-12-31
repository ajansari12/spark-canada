import { useState } from "react";
import { Download, FileSpreadsheet, FileJson } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useExports, CSV_COLUMNS } from "@/hooks/useExports";
import { BusinessIdea } from "@/types/idea";
import { useToast } from "@/hooks/use-toast";

interface ExportDialogProps {
  ideas: BusinessIdea[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExportDialog = ({ ideas, open, onOpenChange }: ExportDialogProps) => {
  const { exportIdeasCSV, exportIdeasJSON } = useExports();
  const { toast } = useToast();
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    CSV_COLUMNS.ideas.map(c => c.key)
  );
  const [format, setFormat] = useState<'csv' | 'json'>('csv');

  const handleExport = () => {
    try {
      let result;
      if (format === 'csv') {
        result = exportIdeasCSV(ideas, selectedColumns);
      } else {
        result = exportIdeasJSON(ideas, selectedColumns);
      }

      toast({
        title: "Export Successful",
        description: `Exported ${result.count} ideas to ${result.filename}`,
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "There was an error exporting your ideas. Please try again.",
      });
    }
  };

  const toggleColumn = (key: string) => {
    if (selectedColumns.includes(key)) {
      setSelectedColumns(selectedColumns.filter(k => k !== key));
    } else {
      setSelectedColumns([...selectedColumns, key]);
    }
  };

  const selectAllColumns = () => {
    setSelectedColumns(CSV_COLUMNS.ideas.map(c => c.key));
  };

  const deselectAllColumns = () => {
    // Keep at least name column
    setSelectedColumns(['name']);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Ideas
          </DialogTitle>
          <DialogDescription>
            Choose your export format and the data columns to include.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Export Format</Label>
            <RadioGroup
              value={format}
              onValueChange={(value) => setFormat(value as 'csv' | 'json')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="flex items-center gap-2 cursor-pointer">
                  <FileSpreadsheet className="w-4 h-4 text-green-600" />
                  CSV (Excel-compatible)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="json" id="json" />
                <Label htmlFor="json" className="flex items-center gap-2 cursor-pointer">
                  <FileJson className="w-4 h-4 text-blue-600" />
                  JSON
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Column Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Columns to Include</Label>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={selectAllColumns}
                  className="h-7 text-xs"
                >
                  Select All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={deselectAllColumns}
                  className="h-7 text-xs"
                >
                  Clear
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto p-3 bg-muted/30 rounded-lg border">
              {CSV_COLUMNS.ideas.map(col => (
                <div key={col.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={col.key}
                    checked={selectedColumns.includes(col.key)}
                    onCheckedChange={() => toggleColumn(col.key)}
                  />
                  <Label
                    htmlFor={col.key}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {col.label}
                  </Label>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedColumns.length} of {CSV_COLUMNS.ideas.length} columns selected
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            className="gap-2"
            disabled={selectedColumns.length === 0}
          >
            <Download className="w-4 h-4" />
            Export {ideas.length} {ideas.length === 1 ? 'Idea' : 'Ideas'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
