<?php

namespace Tests\Feature;

use App\FinancialTransaction;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class FinancialTransactionTagsTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testNoTag()
    {
        $transaction = factory(FinancialTransaction::class)->states('no-tags')->make([
            'title' => 'A title without tags'
        ]);

        $this->assertEquals([], $transaction->tags);

        $transaction->tagsEdit();

        $this->assertEquals([], $transaction->tags);
        $this->assertEquals('A title without tags', $transaction->title);
    }

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testOneTag()
    {
        $transaction = factory(FinancialTransaction::class)->states('no-tags')->make([
            'title' => 'A title with a #tag'
        ]);

        $this->assertEquals([], $transaction->tags);

        $transaction->tagsEdit();

        $this->assertEquals(['tag'], $transaction->tags);
        $this->assertEquals('A title with a tag', $transaction->title);
    }

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testManyTag()
    {
        $transaction = factory(FinancialTransaction::class)->states('no-tags')->make([
            'title' => 'A #title with two #tags'
        ]);

        $this->assertEquals([], $transaction->tags);

        $transaction->tagsEdit();

        $this->assertEquals(['title', 'tags'], $transaction->tags);
        $this->assertEquals('A title with two tags', $transaction->title);
    }

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testTagFirstToLowerCase()
    {
        $transaction = factory(FinancialTransaction::class)->states('no-tags')->make([
            'title' => 'A title with a #Tag'
        ]);

        $this->assertEquals([], $transaction->tags);

        $transaction->tagsEdit();

        $this->assertEquals(['tag'], $transaction->tags);
        $this->assertEquals('A title with a Tag', $transaction->title);
    }

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testTagToLowerCase()
    {
        $transaction = factory(FinancialTransaction::class)->states('no-tags')->make([
            'title' => 'A title with a #TAG'
        ]);

        $this->assertEquals([], $transaction->tags);

        $transaction->tagsEdit();

        $this->assertEquals(['tag'], $transaction->tags);
        $this->assertEquals('A title with a TAG', $transaction->title);
    }

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testNoDuplicatedTag()
    {
        $transaction = factory(FinancialTransaction::class)->states('no-tags')->make([
            'title' => 'This #tag is a duplicated #TAG'
        ]);

        $this->assertEquals([], $transaction->tags);

        $transaction->tagsEdit();

        $this->assertEquals(['tag'], $transaction->tags);
        $this->assertEquals('This tag is a duplicated TAG', $transaction->title);
    }


}
