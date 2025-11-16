'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/lib/store/app-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Database, CheckCircle, AlertCircle } from 'lucide-react'

export function PersistenceTest() {
  const [testResults, setTestResults] = useState<any[]>([])
  const [isRunning, setIsRunning] = useState(false)
  
  const products = useAppStore(state => state.products)
  const addProduct = useAppStore(state => state.addProduct)
  const resetProducts = useAppStore(state => state.resetProducts)
  const forceSync = useAppStore(state => state.forceSync)

  const runTest = async (testName: string, testFn: () => Promise<boolean>) => {
    console.log(`🧪 [TEST] Début: ${testName}`)
    const startTime = Date.now()
    
    try {
      const success = await testFn()
      const duration = Date.now() - startTime
      
      const result = {
        name: testName,
        success,
        duration,
        timestamp: new Date().toLocaleTimeString('fr-FR')
      }
      
      setTestResults(prev => [...prev, result])
      console.log(`✅ [TEST] ${testName}: ${success ? 'SUCCÈS' : 'ÉCHEC'} (${duration}ms)`)
      
      return success
    } catch (error) {
      const duration = Date.now() - startTime
      const result = {
        name: testName,
        success: false,
        duration,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        timestamp: new Date().toLocaleTimeString('fr-FR')
      }
      
      setTestResults(prev => [...prev, result])
      console.error(`❌ [TEST] ${testName}: ÉCHEC (${duration}ms)`, error)
      
      return false
    }
  }

  const runAllTests = async () => {
    setIsRunning(true)
    setTestResults([])
    
    console.log('🚀 [TEST] === DÉBUT DES TESTS DE PERSISTANCE ===')
    
    // Test 1: Ajout d'un produit
    await runTest('Ajout produit', async () => {
      const testProduct = {
        id: `test-${Date.now()}`,
        name: `Produit Test ${Date.now()}`,
        slug: `produit-test-${Date.now()}`,
        brand: 'Test Brand',
        description: 'Produit de test pour la persistance',
        shortDescription: 'Test persistance',
        price: 1000,
        priceUnit: 'XOF',
        category: 'test',
        images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+VGVzdDwvdGV4dD48L3N2Zz4='],
        mainImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+VGVzdDwvdGV4dD48L3N2Zz4=',
        stock: 10,
        featured: false,
        new: true,
        specifications: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      return await addProduct(testProduct)
    })
    
    // Test 2: Vérification du stockage localStorage
    await runTest('Vérification localStorage', async () => {
      const stored = localStorage.getItem('xarala-products-v2')
      if (!stored) return false
      
      const data = JSON.parse(stored)
      return data.products && Array.isArray(data.products) && data.products.length > 0
    })
    
    // Test 3: Vérification du backup
    await runTest('Vérification backup', async () => {
      const backup = localStorage.getItem('xarala-products-backup-v2')
      if (!backup) return false
      
      const data = JSON.parse(backup)
      return data.products && Array.isArray(data.products) && data.products.length > 0
    })
    
    // Test 4: Synchronisation forcée
    await runTest('Synchronisation forcée', async () => {
      forceSync()
      return true
    })
    
    // Test 5: Vérification de la cohérence des données
    await runTest('Cohérence des données', async () => {
      const stored = localStorage.getItem('xarala-products-v2')
      if (!stored) return false
      
      const data = JSON.parse(stored)
      const storedCount = data.products.length
      const storeCount = products.length
      
      return storedCount === storeCount
    })
    
    console.log('🏁 [TEST] === FIN DES TESTS ===')
    setIsRunning(false)
  }

  const clearResults = () => {
    setTestResults([])
  }

  const successCount = testResults.filter(r => r.success).length
  const totalCount = testResults.length

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Tests de Persistance
        </CardTitle>
        <div className="flex items-center gap-4">
          <Badge variant="outline">
            {products.length} produits en mémoire
          </Badge>
          <Badge variant={successCount === totalCount && totalCount > 0 ? "default" : "secondary"}>
            {successCount}/{totalCount} tests réussis
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={runAllTests} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Database className="w-4 h-4" />
            )}
            {isRunning ? 'Tests en cours...' : 'Lancer les tests'}
          </Button>
          
          <Button 
            onClick={clearResults} 
            variant="outline"
            disabled={isRunning}
          >
            Effacer les résultats
          </Button>
          
          <Button 
            onClick={resetProducts} 
            variant="destructive"
            disabled={isRunning}
          >
            Réinitialiser les données
          </Button>
        </div>
        
        {testResults.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">Résultats des tests :</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {testResults.map((result, index) => (
                <div 
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    result.success 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {result.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <div>
                      <div className="font-medium text-gray-900">
                        {result.name}
                      </div>
                      {result.error && (
                        <div className="text-sm text-red-600">
                          {result.error}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {result.duration}ms • {result.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <strong>Tests effectués :</strong>
          <ul className="mt-1 space-y-1">
            <li>• Ajout d'un produit avec images base64</li>
            <li>• Vérification du stockage localStorage principal</li>
            <li>• Vérification du backup de sécurité</li>
            <li>• Test de synchronisation forcée</li>
            <li>• Vérification de la cohérence des données</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
