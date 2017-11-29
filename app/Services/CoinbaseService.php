<?php
/**
 * Created by PhpStorm.
 * User: raphael
 * Date: 16/11/2017
 * Time: 10:08
 */

namespace App\Services;


use Coinbase\Wallet\Client;
use Coinbase\Wallet\Configuration;
use Coinbase\Wallet\Enum\Param;
use Coinbase\Wallet\Resource\Sell;

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



    public static function consoleDisplay(){

        $client = self::connectWithAPI();

        $accounts = $client->getAccounts();


        foreach ($accounts as $account){
            $name = $account->getName();

            $nativeCurrency = $account->getNativeBalance()->getCurrency();

            if ($account->getCurrency() === $nativeCurrency){
                continue;
            }

            echo "=============================" . PHP_EOL;
            echo $name . PHP_EOL;
            echo "Balance   : " . $account->getBalance()->getAmount() . ' ' . $account->getBalance()->getCurrency() . PHP_EOL;
            echo "Value     : " . $account->getNativeBalance()->getAmount() . ' ' . $account->getNativeBalance()->getCurrency() . PHP_EOL;

            echo PHP_EOL;
            echo "---------------------------" . PHP_EOL;
            echo "Prices" . PHP_EOL;
            echo "---------------------------" . PHP_EOL;

            $sellPrice = floatval($client->getSellPrice($account->getCurrency() . '-' . $nativeCurrency)->getAmount());

            echo $account->getCurrency() . ' spot  : ' . $client->getSpotPrice($account->getCurrency() . '-' . $nativeCurrency)->getAmount() . ' ' . $nativeCurrency . PHP_EOL;
            echo $account->getCurrency() . ' buy   : ' . $client->getBuyPrice($account->getCurrency() . '-' . $nativeCurrency)->getAmount() . ' ' . $nativeCurrency . PHP_EOL;
            echo $account->getCurrency() . ' sell  : ' . $sellPrice . ' ' . $nativeCurrency . PHP_EOL;
            echo PHP_EOL;

            echo "---------------------------" . PHP_EOL;
            echo "Transactions" . PHP_EOL;
            echo "---------------------------" . PHP_EOL;

            $transactions = $client->getAccountTransactions($account);
            $totalBuy = 0.0;
            foreach ($transactions as $transaction){

                echo PHP_EOL;
                echo $transaction->getCreatedAt()->format('d/m/Y')  . PHP_EOL;
                echo $transaction->getAmount()->getCurrency() . ' : ' . $transaction->getAmount()->getAmount()  . PHP_EOL;
                echo $transaction->getNativeAmount()->getCurrency() . ' : ' . $transaction->getNativeAmount()->getAmount()  . PHP_EOL;

                $price = floatval($transaction->getNativeAmount()->getAmount()) / floatval($transaction->getAmount()->getAmount());
                echo $transaction->getAmount()->getCurrency() . ' = ' . $price . ' ' . $transaction->getNativeAmount()->getCurrency() . PHP_EOL;

                $totalBuy += floatval($transaction->getNativeAmount()->getAmount());
            }

            echo PHP_EOL;
            echo "---------------------------" . PHP_EOL;
            echo 'Total' .  PHP_EOL;
            echo "---------------------------" . PHP_EOL;
            echo 'Buys  : ' . $totalBuy . ' ' . $nativeCurrency . PHP_EOL;
            echo 'Now   : ' . $account->getNativeBalance()->getAmount() . ' ' . $nativeCurrency . PHP_EOL;
            $gains = floatval($account->getNativeBalance()->getAmount()) - $totalBuy;
            $p = $totalBuy == 0 ? 0 : ($gains/$totalBuy)*100;

            echo "Gains : " . $gains  . ' ' . $nativeCurrency . PHP_EOL;
            echo " ==>  : " . $p . ' %' . PHP_EOL;

            if (floatval($account->getBalance()->getAmount() > 0)){
                echo PHP_EOL;
                echo "---------------------------" . PHP_EOL;
                echo 'Sell now (fees included)' .  PHP_EOL;
                echo "---------------------------" . PHP_EOL;
                $sell = new Sell([
                    'bitcoinAmount' => $account->getBalance()->getAmount()
                ]);

                $client->createAccountSell($account, $sell, [Param::COMMIT => false]);

                $sellTotal = $sell->getTotal()->getAmount();
                echo "Price : " . $sellTotal . ' ' . $nativeCurrency . PHP_EOL;
                echo " ==>  : " . ($sellTotal - $totalBuy) . ' ' . $nativeCurrency . PHP_EOL;
                echo " ==>  : " . ($sellTotal - $totalBuy)/$totalBuy*100 . ' %' . PHP_EOL;

            }

            echo PHP_EOL;

        }

    }

}