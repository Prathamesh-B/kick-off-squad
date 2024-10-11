import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";
import { ChevronLeftIcon } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    return (
        <div className="flex items-center justify-center space-x-2 mt-4">
            <Button
                variant="ghost"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="gap-1 pl-2.5"
            >
                <ChevronLeftIcon className="h-4 w-4 pt-0.5" />
                Previous
            </Button>
            <span className="text-sm">{`${currentPage} of ${totalPages}`}</span>
            <Button
                className="gap-1 pr-2.5"
                variant="ghost"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
                <ChevronRightIcon className="h-4 w-4 pt-0.5" />
            </Button>
        </div>
    );
}
