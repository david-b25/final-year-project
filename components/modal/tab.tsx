
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/editor/ui/tabs"

export function TabsDemo() {
  return (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Image</TabsTrigger>
        <TabsTrigger value="password">Video</TabsTrigger>
      </TabsList>
      <TabsContent value="image">
        
      </TabsContent>
      <TabsContent value="video">
        
      </TabsContent>
    </Tabs>
  )
}
