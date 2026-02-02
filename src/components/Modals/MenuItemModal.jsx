"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  addToast,
} from "@heroui/react";
import { useDispatch } from "react-redux";
import { addItemToCart } from "@/store/cartSlice";
import { add_to_cart } from "@/Api/api";

const MenuItemModal = ({ isOpen, onOpenChange, selectedItem }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    if (!selectedItem?.id) return;

    setAddingToCart(true);
    try {
      const response = await add_to_cart(selectedItem.id, 1);
      if (response?.success) {
        dispatch(addItemToCart(response));
        addToast({
          title: t("cardapio.add_success.title"),
          description: response.message || t("cardapio.add_success.message"),
          color: "success",
        });
        onOpenChange(false);
      } else {
        addToast({
          title: t("cardapio.add_error.title"),
          description: response?.error || t("cardapio.add_error.message"),
          color: "danger",
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      addToast({
        title: t("cardapio.add_error.title"),
        description: t("cardapio.add_error.message"),
        color: "danger",
      });
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
      scrollBehavior="inside"
      placement="center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            {selectedItem && (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <h2 className="text-2xl font-bold">{selectedItem.name}</h2>
                  {selectedItem.category && (
                    <p className="text-sm text-gray-500 font-normal">
                      {selectedItem.category.name}
                    </p>
                  )}
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col gap-4">
                    {/* Image */}
                    {selectedItem.image || selectedItem.images?.[0] ? (
                      <div className="w-full h-64 rounded-lg overflow-hidden">
                        <Image
                          src={
                            selectedItem.image ||
                            selectedItem.images?.[0] ||
                            "/cardapio/default.png"
                          }
                          alt={selectedItem.name}
                          width={800}
                          height={400}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : null}

                    {/* Description */}
                    {selectedItem.description && (
                      <div>
                        <h3 className="font-semibold mb-2">
                          {t("cardapio.description")}
                        </h3>
                        <p className="text-gray-700">
                          {selectedItem.description}
                        </p>
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                      <span className="font-semibold text-lg">
                        {t("cardapio.price")}:
                      </span>
                      <span className="text-2xl font-bold text-red-600">
                        {selectedItem.formatted_price || selectedItem.price}
                      </span>
                    </div>

                    {/* Additional Info */}
                    <div className="grid grid-cols-2 gap-4">
                      {selectedItem.prep_time && (
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">
                            {t("cardapio.prepTime")}
                          </span>
                          <span className="font-semibold">
                            {selectedItem.prep_time} {t("cardapio.minutes")}
                          </span>
                        </div>
                      )}
                      {selectedItem.calories && (
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">
                            {t("cardapio.calories")}
                          </span>
                          <span className="font-semibold">
                            {selectedItem.calories} {t("cardapio.cal")}
                          </span>
                        </div>
                      )}
                      {selectedItem.is_available !== undefined && (
                        <div className="flex flex-col col-span-2">
                          <span className="text-sm text-gray-500">
                            {t("cardapio.availability")}
                          </span>
                          <span
                            className={`font-semibold ${selectedItem.is_available
                                ? "text-green-600"
                                : "text-red-600"
                              }`}
                          >
                            {selectedItem.is_available
                              ? t("cardapio.available")
                              : t("cardapio.unavailable")}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Allergens */}
                    {selectedItem.allergens &&
                      selectedItem.allergens.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-2">
                            {t("cardapio.allergens")}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedItem.allergens.map((allergen, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                              >
                                {allergen}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Dietary Tags */}
                    {selectedItem.dietary_tags &&
                      selectedItem.dietary_tags.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-2">
                            {t("cardapio.dietaryTags")}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedItem.dietary_tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={onClose}
                  >
                    {t("cardapio.close")}
                  </Button>
                  {selectedItem.is_available && (
                    <Button
                      color="primary"
                      onPress={handleAddToCart}
                      className="bg-red-600 text-white"
                      isLoading={addingToCart}
                      isDisabled={addingToCart}
                    >
                      {addingToCart ? t("cardapio.adding") : t("cardapio.addToCart")}
                    </Button>
                  )}
                </ModalFooter>
              </>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default MenuItemModal;
