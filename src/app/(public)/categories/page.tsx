import { getActiveCategories } from "@/lib/services/categories";
import { CategoryList } from "./category-list";
import { Container } from "@/components/layouts/container";

export const metadata = {
  title: "Service Categories - Blue Collar Marketplace",
  description: "Explore the wide range of service categories available on Digital Blue Collar platform.",
};

export default async function CategoriesPage() {
  const categories = await getActiveCategories();

  return (
    <Container className="py-12 md:py-20">
      <div className="space-y-4 mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Browse by Category</h1>
        <p className="text-lg text-muted-500">Find specialized skills mapped directly to local needs.</p>
      </div>

      <CategoryList initialCategories={categories} />
    </Container>
  );
}
