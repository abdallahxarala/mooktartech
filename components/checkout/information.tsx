"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckoutStep } from "@/app/checkout/page";

const schema = z.object({
  firstName: z.string().min(2, "Le prénom est requis"),
  lastName: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  address: z.string().min(5, "L'adresse est requise"),
  city: z.string().min(2, "La ville est requise"),
  postalCode: z.string().min(5, "Code postal invalide"),
  sameAsShipping: z.boolean(),
});

interface CheckoutInformationProps {
  onNext: (step: CheckoutStep) => void;
}

export function CheckoutInformation({ onNext }: CheckoutInformationProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const sameAsShipping = watch("sameAsShipping");

  const onSubmit = (data: any) => {
    console.log(data);
    onNext("shipping");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-6">Informations personnelles</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              {...register("firstName")}
              placeholder="Prénom"
              className="w-full"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.firstName.message as string}
              </p>
            )}
          </div>
          
          <div>
            <Input
              {...register("lastName")}
              placeholder="Nom"
              className="w-full"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lastName.message as string}
              </p>
            )}
          </div>
          
          <div>
            <Input
              {...register("email")}
              type="email"
              placeholder="Email"
              className="w-full"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message as string}
              </p>
            )}
          </div>
          
          <div>
            <Input
              {...register("phone")}
              placeholder="Téléphone"
              className="w-full"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message as string}
              </p>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-6">Adresse de facturation</h2>
        
        <div className="space-y-4">
          <div>
            <Input
              {...register("address")}
              placeholder="Adresse"
              className="w-full"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">
                {errors.address.message as string}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                {...register("city")}
                placeholder="Ville"
                className="w-full"
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.city.message as string}
                </p>
              )}
            </div>
            
            <div>
              <Input
                {...register("postalCode")}
                placeholder="Code postal"
                className="w-full"
              />
              {errors.postalCode && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.postalCode.message as string}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox {...register("sameAsShipping")} id="sameAsShipping" />
        <label
          htmlFor="sameAsShipping"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Utiliser la même adresse pour la livraison
        </label>
      </div>

      {!sameAsShipping && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Adresse de livraison</h2>
          <div className="space-y-4">
            {/* Répéter les champs d'adresse pour la livraison */}
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <Button type="submit" className="bg-primary-orange hover:bg-primary-orange/90">
          Continuer vers la livraison
        </Button>
      </div>
    </form>
  );
}
