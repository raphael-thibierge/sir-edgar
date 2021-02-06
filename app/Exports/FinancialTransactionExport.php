<?php
/**
 * Created by PhpStorm.
 * User: raphael
 * Date: 25/03/2018
 * Time: 15:25
 */

namespace App\Exports;


use App\FinancialTransaction;
use App\Models\User;
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

class FinancialTransactionExport implements FromQuery, WithMapping, ShouldAutoSize, WithHeadings, WithTitle
{

    /**
     * @var User
     */
    private $user;

    /**
     * @var int
     */
    private $year = 0;
    private $month = 0;

    use Exportable;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * @return Builder
     */
    public function query()
    {
        $query = FinancialTransaction::query()
            ->where('user_id', $this->user->id)
        ;

        if ($this->month > 0){
            $startDate = new Carbon("{$this->month}/1/{$this->year}");
            $endDate = new Carbon(($this->month+1) . "/1/{$this->year}");

            $query->where('date', '>=', $startDate);
            $query->where('date', '<', $endDate);
        }

        return $query;
    }

    public function forMonth(int $month, int $year){
        $this->month = $month;
        $this->year = $year;
        return $this;
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