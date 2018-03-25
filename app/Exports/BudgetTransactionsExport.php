<?php
/**
 * Created by PhpStorm.
 * User: raphael
 * Date: 25/03/2018
 * Time: 15:25
 */

namespace App\Exports;


use App\Budget;
use App\FinancialTransaction;
use App\User;
use Carbon\Carbon;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;

class BudgetTransactionsExport implements FromQuery, WithMapping, ShouldAutoSize, WithHeadings, WithTitle
{
    use Exportable;

    /**
     * @var Budget
     */
    private $budget;


    public function __construct(Budget $budget)
    {
        $this->budget = $budget;
    }

    /**
     * @return Builder
     */
    public function query()
    {
        return $this->budget->expenses();
    }

    /**
     * @param mixed $transaction
     * @return array
     * @internal param mixed $row
     *
     */
    public function map($transaction): array
    {
        return [
            $transaction->type,
            $transaction->title,
            $transaction->price,
            $transaction->currency,
            $transaction->date,
            is_array($transaction->tags === 'array') ? implode(', ', $transaction->tags) : '',
            $transaction->description
        ];
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'Type', 'Title', 'Price', 'Currency', 'Date', 'Tags', 'Description'
        ];
    }

    /**
     * @return string
     */
    public function title(): string
    {
        if ($this->month > 0){
            "Fiancial transaction of {$this->month}/{$this->year}";
        } else if ($this->year > 0){
            "Fiancial transaction of {$this->year}";
        }
        return "All financial transactions";
    }
}