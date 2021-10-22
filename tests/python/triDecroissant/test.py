import unittest
import random
import codewars_test as test


from funcFile import tri_decroissant

@test.describe('Resultats des tests de tri_decroissant()')
def example_tests():

    @test.it('Test 1')
    def test_10():
        l = [i for i in range(10)]
        random.shuffle(l)
        test.assert_equals(tri_decroissant(l),sorted(l,reverse=True),'Ce test est un échec', allow_raise=False)

    @test.it('Test 2')
    def test_100():
        l = [i for i in range(100)]
        random.shuffle(l)
        test.assert_equals(tri_decroissant(l),sorted(l,reverse=True),'Ce test est un échec', allow_raise=False)
    
    @test.it('Test 3')
    def test_1000():
        l = [i for i in range(1000)]
        random.shuffle(l)
        test.assert_equals(tri_decroissant(l),sorted(l,reverse=True),'Ce test est un échec', allow_raise=False)

    @test.it('Test 4')
    def test_10000():
        l = [i for i in range(10000)]
        random.shuffle(l)
        test.assert_equals(tri_decroissant(l),sorted(l,reverse=True),'Ce test est un échec', allow_raise=False)
