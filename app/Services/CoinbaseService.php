<?php
/**
 * Created by PhpStorm.
 * User: raphael
 * Date: 16/11/2017
 * Time: 10:08
 */

namespace App\Services;


use App\OAuthConnection;
use App\User;
use Coinbase\Wallet\Client;
use Coinbase\Wallet\Configuration;
use Coinbase\Wallet\Enum\Param;
use Coinbase\Wallet\Resource\Account;
use Coinbase\Wallet\Resource\Buy;
use Coinbase\Wallet\Resource\Sell;
use Coinbase\Wallet\Value\Money;

class CoinbaseService extends OAuthService
{

    protected $authorize_url = 'https://www.coinbase.com/oauth/authorize';

    protected $token_url = 'http://www.coinbase.com/oauth/token';

    protected $service = 'coinbase';

    protected $scopes = [
        'wallet:accounts:read',
        'wallet:accounts:update',
        //'wallet:accounts:create',
        //'wallet:accounts:delete',
        'wallet:addresses:read',
        //'wallet:addresses:create',
        'wallet:buys:read',
        'wallet:buys:create',
        'wallet:checkouts:read',
        'wallet:checkouts:create',
        'wallet:deposits:read',
        'wallet:deposits:create',
        'wallet:notifications:read',
        'wallet:orders:read',
        'wallet:orders:create',
        'wallet:orders:refund',
        'wallet:payment-methods:read',
        //'wallet:payment-methods:delete',
        'wallet:payment-methods:limits',
        'wallet:sells:read',
        'wallet:sells:create',
        'wallet:transactions:read',
        //'wallet:transactions:send',
        //'wallet:transactions:request',
        //'wallet:transactions:transfer',
        'wallet:user:read',
        //'wallet:user:update',
        //'wallet:user:email',
        'wallet:withdrawals:read',
        'wallet:withdrawals:create',
    ];

    protected $options = [
        'account' => 'all',
    ];

    public static function connectWithAPI(){

        $apiKey = env('COINBASE_API_KEY');
        $apiSecret = env('COINBASE_API_SECRET');

        $configuration = Configuration::apiKey($apiKey, $apiSecret);
        $client = Client::create($configuration);

        //$user = $client->getCurrentUser();

        //$client->getAccounts()

        return $client;
    }

    public function getAccessTocken()
    {
        // TODO: Implement getAccessTocken() method.
    }


    public static function printLine(string $line, $console = true){
        if (!$console)
            $line = str_replace(PHP_EOL, "<br>", $line);
        echo $line;
    }

    public static function consoleDisplay($client, $console = true){

        $accounts = $client->getAccounts();

        $totalNativeBalance = 0.0;
        $totalNativeBuys= 0.0;

        foreach ($accounts as $account){
            $name = $account->getName();

            $balance = floatval($account->getBalance()->getAmount());
            $currency = $account->getCurrency();
            $nativeCurrency = $account->getNativeBalance()->getCurrency();
            $nativeCurrencyBalance = floatval($account->getNativeBalance()->getAmount());
            $totalNativeBalance += $nativeCurrencyBalance;

            if ($currency === $nativeCurrency){
                continue;
            }

            self::printLine("=============================" . PHP_EOL, $console);
            self::printLine("Wallet    : " . $name . PHP_EOL, $console);
            self::printLine("Balance   : " . $balance . ' ' . $currency . PHP_EOL, $console);
            //echo "Value     : " . $nativeCurrencyBalance . ' ' . $nativeCurrency . PHP_EOL;

            //self::printLine(PHP_EOL, $console);
            //self::printLine("---------------------------" . PHP_EOL, $console);
            //self::printLine("Prices" . PHP_EOL, $console);
            //self::printLine("---------------------------" . PHP_EOL, $console);

            //$sellPrice = floatval($client->getSellPrice($currency . '-' . $nativeCurrency)->getAmount());
            //$spotPrice = floatval($client->getSpotPrice($currency . '-' . $nativeCurrency)->getAmount());
            $buyPrice = floatval($client->getBuyPrice($currency . '-' . $nativeCurrency)->getAmount());

            //self::printLine($currency . ' spot  : ' . $spotPrice . ' ' . $nativeCurrency . PHP_EOL, $console);
            //self::printLine($currency . ' buy   : ' . $buyPrice . ' ' . $nativeCurrency . PHP_EOL, $console);
            //self::printLine($currency . ' sell  : ' . $sellPrice . ' ' . $nativeCurrency . PHP_EOL, $console);

            //echo PHP_EOL;
            //echo "---------------------------" . PHP_EOL;
            //echo "Transactions" . PHP_EOL;
            //echo "---------------------------" . PHP_EOL;

            $transactions = $client->getAccountTransactions($account);
            $totalBuy = 0.0;
            foreach ($transactions as $transaction){

                //echo PHP_EOL;
                //echo $transaction->getCreatedAt()->format('d/m/Y')  . PHP_EOL;
                //echo $transaction->getAmount()->getCurrency() . ' : ' . $transaction->getAmount()->getAmount()  . PHP_EOL;
                //echo $transaction->getNativeAmount()->getCurrency() . ' : ' . $transaction->getNativeAmount()->getAmount()  . PHP_EOL;

                $price = floatval($transaction->getNativeAmount()->getAmount()) / floatval($transaction->getAmount()->getAmount());
                //echo $transaction->getAmount()->getCurrency() . ' = ' . $price . ' ' . $transaction->getNativeAmount()->getCurrency() . PHP_EOL;

                $totalBuy += floatval($transaction->getNativeAmount()->getAmount());
            }
            $totalNativeBuys += $totalBuy;

            self::printLine('Buys : ' . $totalBuy . ' ' . $nativeCurrency . PHP_EOL, $console);
            self::printLine('Now  : ' . $nativeCurrencyBalance . ' ' . $nativeCurrency . PHP_EOL, $console);
            $gains = floatval($nativeCurrencyBalance) - $totalBuy;
            $p = $totalBuy == 0 ? 0 : ($gains/$totalBuy)*100;

            self::printLine("  ==> " . $gains  . ' ' . $nativeCurrency . PHP_EOL, $console);
            self::printLine("  ==> " . $p . ' %' . PHP_EOL, $console);

            if ($balance > 0){

                self::printLine(PHP_EOL, $console);
                self::printLine("---------------------------" . PHP_EOL, $console);
                self::printLine('Sell now (fees included)' .  PHP_EOL, $console);
                self::printLine("---------------------------" . PHP_EOL, $console);


                //dd($balance);

                $sell = new Sell();
                $sell->setAmount(new Money($balance, $currency));
                $client->createAccountSell($account, $sell, [Param::COMMIT => false]);
                $sellTotal = $sell->getTotal()->getAmount();
                $realGain = $sellTotal - $totalBuy;

                self::printLine("Price : " . $sellTotal . ' ' . $nativeCurrency . PHP_EOL, $console);
                self::printLine("   ==>  " . $realGain . ' ' . $nativeCurrency . PHP_EOL, $console);
                self::printLine("   ==>  " . ($sellTotal - $totalBuy)/$totalBuy*100 . ' %' . PHP_EOL, $console);

                self::printLine(PHP_EOL, $console);
                self::printLine("---------------------------" . PHP_EOL, $console);
                self::printLine('Buy later (fees included)' .  PHP_EOL, $console);
                self::printLine("---------------------------" . PHP_EOL, $console);

                // set amount
                $buy = new Buy();
                $buy->setAmount(new Money($sellTotal, $nativeCurrency));
                $client->createAccountBuy($account, $buy, [Param::COMMIT => false]);
                $feesValue = floatval($buy->getFees()[0]->getAmount()->getAmount());

                // remove fees from amount
                $buy = new Buy();
                $buy->setAmount(new Money($sellTotal-$feesValue, $nativeCurrency));
                $client->createAccountBuy($account, $buy, [Param::COMMIT => false]);
                $feesValue = floatval($buy->getFees()[0]->getAmount()->getAmount());

                $buyUnder = ($sellTotal - $feesValue) / $balance ;
                $buyUnderSpot = $buyUnder*0.99;

                self::printLine("BTC prices" . PHP_EOL, $console);
                self::printLine("Buy  < " . $buyUnder . ' ' . $nativeCurrency . PHP_EOL, $console);
                self::printLine("Spot < " . $buyUnderSpot . ' ' . $nativeCurrency . PHP_EOL, $console);
                self::printLine("   ==> " . ($buyUnderSpot-$buyPrice) . ' EUR'. PHP_EOL, $console);
                self::printLine("   ==> " . (($buyUnderSpot-$buyPrice)/$buyPrice)*100 . ' %'. PHP_EOL, $console);
            }
            self::printLine(PHP_EOL, $console);

        }
        self::printLine(PHP_EOL, $console);
        self::printLine("=============================" . PHP_EOL, $console);
        self::printLine("---------------------------" . PHP_EOL, $console);
        self::printLine('Total' .  PHP_EOL, $console);
        self::printLine("---------------------------" . PHP_EOL, $console);
        self::printLine('Buys : ' . $totalNativeBuys . ' ' . $nativeCurrency . PHP_EOL, $console);
        self::printLine('Now  : ' . $totalNativeBalance . ' ' . $nativeCurrency . PHP_EOL, $console);
    }

    public static function fees(){
        $client = self::connectWithAPI();

        $account = $client->getAccounts()[3];

        $lastFees = null;

        $nativeCurrency = $account->getNativeBalance()->getCurrency();

        for ($price = 2; $price < 76; $price++){
            $buy = new Buy();
            $buy->setAmount(new Money($price, $nativeCurrency));
            $client->createAccountBuy($account, $buy, [Param::COMMIT => false]);
            $feesValue = floatval($buy->getFees()[0]->getAmount()->getAmount());

            if ($lastFees == null || $lastFees !== $feesValue){
                echo "$price $nativeCurrency : $feesValue $nativeCurrency" . PHP_EOL;
                $lastFees = $feesValue;
            }
        }

    }

    public function getAccountTotalSellPrice(Client $client, Account $account){
        if (floatval($account->getBalance()->getAmount()) > 0){
            $sell = new Sell([
                'bitcoinAmount' => $account->getBalance()->getAmount()
            ]);


            // native balance
            // balance
            // sell balance
            // fees

            $client->createAccountSell($account, $sell, [Param::COMMIT => false]);
            $sellTotal = $sell->getTotal()->getAmount();
        }
    }

}