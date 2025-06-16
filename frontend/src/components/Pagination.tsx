// frontend/src/components/Pagination.tsx
import { ArrowLeft, ArrowRight } from 'lucide-react'; 

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const pageNumbers = [];
  // Logic to show a limited range of page numbers around the current page
  const maxPageNumbersToShow = 5; // Adjust as needed
  let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbersToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPageNumbersToShow - 1);

  // Adjust startPage if endPage is capped
   if (endPage === totalPages) {
     startPage = Math.max(1, totalPages - maxPageNumbersToShow + 1);
   }


  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }


  return (
    <nav className="mt-12 flex justify-center">
      <ul className="inline-flex -space-x-px">
        <li>
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`py-2 px-3 ml-0 leading-tight text-slate-500 bg-white border border-slate-300 rounded-l-lg hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
             <ArrowLeft className="h-4 w-4 mr-2 inline-block" />
            Previous
          </button>
        </li>
        {/* Show first page always if not in the range */}
        {startPage > 1 && (
             <li>
               <button onClick={() => onPageChange(1)} className="py-2 px-3 leading-tight border border-slate-300 text-slate-500 bg-white hover:bg-slate-100 hover:text-slate-700">
                 1
               </button>
             </li>
        )}
         {startPage > 2 && (
             <li>
               <span className="py-2 px-3 leading-tight text-slate-500 bg-white border border-slate-300">...</span>
             </li>
         )}
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              onClick={() => onPageChange(number)}
              className={`py-2 px-3 leading-tight border border-slate-300 ${
                currentPage === number
                  ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700'
                  : 'text-slate-500 bg-white hover:bg-slate-100 hover:text-slate-700'
              }`}
            >
              {number}
            </button>
          </li>
        ))}
         {endPage < totalPages - 1 && (
             <li>
               <span className="py-2 px-3 leading-tight text-slate-500 bg-white border border-slate-300">...</span>
             </li>
         )}
        {/* Show last page always if not in the range */}
        {endPage < totalPages && (
             <li>
               <button onClick={() => onPageChange(totalPages)} className="py-2 px-3 leading-tight border border-slate-300 text-slate-500 bg-white hover:bg-slate-100 hover:text-slate-700">
                 {totalPages}
               </button>
             </li>
        )}
        <li>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`py-2 px-3 leading-tight text-slate-500 bg-white border border-slate-300 rounded-r-lg hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
             <ArrowRight className="h-4 w-4 ml-2 inline-block" />
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
