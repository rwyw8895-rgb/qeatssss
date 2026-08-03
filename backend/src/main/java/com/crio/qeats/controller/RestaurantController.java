/*
 *
 *  * Copyright (c) Crio.Do 2019. All rights reserved
 *
 */

package com.crio.qeats.controller;

import com.crio.qeats.exchanges.GetRestaurantsRequest;
import com.crio.qeats.exchanges.GetRestaurantsResponse;
import com.crio.qeats.dto.OrderRequest;
import com.crio.qeats.models.OrderEntity;
import com.crio.qeats.repositories.OrderRepository;
import com.crio.qeats.services.RestaurantService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalTime;
import java.util.Iterator;
import java.util.List;
import javax.validation.Valid;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// TODO: CRIO_TASK_MODULE_RESTAURANTSAPI
// Implement Controller using Spring annotations.
// Remember, annotations have various "targets". They can be class level, method level or others.
@RestController
@RequestMapping(RestaurantController.RESTAURANT_API_ENDPOINT)
public class RestaurantController {

  public static final String RESTAURANT_API_ENDPOINT = "/qeats/v1";
  public static final String RESTAURANTS_API = "/restaurants";
  public static final String MENU_API = "/menu";
  public static final String CART_API = "/cart";
  public static final String CART_ITEM_API = "/cart/item";
  public static final String CART_CLEAR_API = "/cart/clear";
  public static final String POST_ORDER_API = "/order";
  public static final String GET_ORDERS_API = "/orders";

  @Autowired
  private RestaurantService restaurantService;

  @Autowired
  private OrderRepository orderRepository;

  private final ObjectMapper objectMapper = new ObjectMapper();

  @GetMapping(RESTAURANTS_API)
  public ResponseEntity<GetRestaurantsResponse> getRestaurants(
      @Valid GetRestaurantsRequest getRestaurantsRequest) {

    //log.info("getRestaurants called with {}", getRestaurantsRequest);
    
    GetRestaurantsResponse getRestaurantsResponse;

      //CHECKSTYLE:OFF
      getRestaurantsResponse = restaurantService
          .findAllRestaurantsCloseBy(getRestaurantsRequest, LocalTime.now());
    //  log.info("getRestaurants returned {}", getRestaurantsResponse);
      //CHECKSTYLE:ON
      if(getRestaurantsResponse!=null && !getRestaurantsResponse.getRestaurants().isEmpty()) {
     getRestaurantsResponse.getRestaurants().forEach((res) -> {
      res.setName(res.getName().replaceAll("é", "e"));
     });
    }
     // Iterator it = set.iterator();
    
    return ResponseEntity.ok().body(getRestaurantsResponse);
    }

  @PostMapping(POST_ORDER_API)
  public ResponseEntity<OrderEntity> placeOrder(
      @RequestBody @Valid OrderRequest orderRequest) {
    if (orderRequest.getItems() == null || orderRequest.getItems().isEmpty()) {
      return ResponseEntity.badRequest().build();
    }

    OrderEntity orderEntity = new OrderEntity();
    orderEntity.setOrderId("ORD-" + (100000 + (int) (Math.random() * 900000)));
    orderEntity.setRestaurantId(orderRequest.getRestaurantId());
    orderEntity.setRestaurantName(orderRequest.getRestaurantName());
    orderEntity.setItems(orderRequest.getItems());
    orderEntity.setTotalAmount(orderRequest.getTotalAmount());
    orderEntity.setStatus("PLACED");
    orderEntity.setCreatedAt(orderRequest.getCreatedAt() != null ? orderRequest.getCreatedAt() : java.time.Instant.now().toString());
    orderEntity.setDeliveryAddress(orderRequest.getDeliveryAddress());
    orderEntity.setEtaMinutes(orderRequest.getEtaMinutes() != null ? orderRequest.getEtaMinutes() : 25);
    orderEntity.setLatitude(orderRequest.getLatitude());
    orderEntity.setLongitude(orderRequest.getLongitude());

    OrderEntity savedOrder = orderRepository.save(orderEntity);
    return ResponseEntity.status(HttpStatus.CREATED).body(savedOrder);
  }

  @GetMapping(GET_ORDERS_API)
  public ResponseEntity<List<OrderEntity>> getOrders() {
    return ResponseEntity.ok(orderRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt")));
  }
}

  // TIP(MODULE_MENUAPI): Model Implementation for getting menu given a restaurantId.
  // Get the Menu for the given restaurantId
  // API URI: /qeats/v1/menu?restaurantId=11
  // Method: GET
  // Query Params: restaurantId
  // Success Output:
  // 1). If restaurantId is present return Menu
  // 2). Otherwise respond with BadHttpRequest.
  //
  // HTTP Code: 200
  // {
  //  "menu": {
  //    "items": [
  //      {
  //        "attributes": [
  //          "South Indian"
  //        ],
  //        "id": "1",
  //        "imageUrl": "www.google.com",
  //        "itemId": "10",
  //        "name": "Idly",
  //        "price": 45
  //      }
  //    ],
  //    "restaurantId": "11"
  //  }
  // }
  // Error Response:
  // HTTP Code: 4xx, if client side error.
  //          : 5xx, if server side error.
  // Eg:
  // curl -X GET "http://localhost:8081/qeats/v1/menu?restaurantId=11"



  // @GetMapping(RESTAURANTS_API)
  // public ResponseEntity<GetRestaurantsResponse> getRestaurants(
  //      GetRestaurantsRequest getRestaurantsRequest) {

  //   log.info("getRestaurants called with {}", getRestaurantsRequest);
  //   GetRestaurantsResponse getRestaurantsResponse;

  //     getRestaurantsResponse = restaurantService
  //         .findAllRestaurantsCloseBy(getRestaurantsRequest, LocalTime.now());
  //     log.info("getRestaurants returned {}", getRestaurantsResponse);

  //   return ResponseEntity.ok().body(getRestaurantsResponse);
  // }














